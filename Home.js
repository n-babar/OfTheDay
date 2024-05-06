// Main home screen component displaying user profile details, including functionality for editing profile, changing profile picture, and viewing followers/following counts.

import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Pressable, Alert, ActivityIndicator } from 'react-native';
import { UserContext } from './userContext';
import { getUser } from './database';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library
import EditProfileModal from './EditProfileModal';
import { getFriendships, getFollowers, updateUserProfile } from './database';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { fetchUserPosts, getOTD } from './database';
import FeedItemProfiles from './FeedItemProfiles';
import { useTab } from './TabContext';

const CLOUDINARY_CLOUD_NAME = 'dybcyj2qc';
const CLOUDINARY_UPLOAD_PRESET = 'iaa4ymix';

const HomePage = ( {route, navigation} ) => {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editProfileVisible, setEditProfileVisible] = useState(false);
    const { setActiveTab = () => {} } = route.params || {}
    const [followingCount, setFollowingCount] = useState(0);
    const [followersCount, setFollowersCount] = useState(0);
    const [userPosts, setUserPosts] = useState([]);
    const otdCache = useRef({});
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { changeTab, setIsBottomBarVisible } = useTab();
    


    const uploadImage = async (uri) => {
        console.log
        const formData = new FormData();
        formData.append('file', {
            uri: uri,
            type: 'image/jpeg', 
            name: 'upload.jpg',
        });
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
            const data = await response.json();
            if (data.secure_url) {
                return data.secure_url;
            } else {
                Alert.alert('Error uploading image', data.error ? data.error.message : 'An error occurred');
                return null;
            }
        } catch (err) {
            console.error('Upload error:', err);
            Alert.alert('Upload error', 'An error occurred while uploading the image.');
            return null;
        }
    };

    const showChangeProfilePicOptions = () => {
        Alert.alert(
            'Change Profile Picture',
            'Select an option',
            [
                { text: 'Take Photo', onPress: takePhoto },
                { text: 'Choose from Library', onPress: chooseFromLibrary },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };
    
    const takePhoto = async () => {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraPermission.status !== 'granted') {
            alert('Camera permission is required to take photos.');
            return;
        }
    
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.cancelled) {
            handleImagePicked(result.assets[0].uri);
        }
    };
    
    const chooseFromLibrary = async () => {
        const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (libraryPermission.status !== 'granted') {
            alert('Permission to access gallery is required to choose photos.');
            return;
        }
    
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.cancelled) {
            handleImagePicked(result.assets[0].uri);
        }
    };

    const handleImagePicked = async (uri) => {
        
        const uploadedImageUrl = await uploadImage(uri);
        if (uploadedImageUrl) {
            const updateResult = await updateUserProfile(currentUser, { profile_pic: uploadedImageUrl });
            if (updateResult.success) {
                fetchUser();
            } else {
                console.error(updateResult.error);
                Alert.alert("Update Failed", "Failed to update profile picture.");
            }
        }
    };

    // This fetchUser function is called to refresh user info
    const fetchUser = async () => {
        try {
            const res = await getUser(currentUser);
            if (!res.failed) {
                setUser(res.user[0]); // Update user state with new data
            } else {
                console.error("Failed to fetch user");
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    //console.log({"current user:": currentUser});

    const fetchFollowingAndFollowers = async () => {
        try {
            const followingResult = await getFriendships(currentUser);
            const followersResult = await getFollowers(currentUser);
            
            if (!followingResult.failed) {
                setFollowingCount(followingResult.friends.length); // Set following count to the length of the returned list
            } else {
                console.error("Failed to fetch following");
            }

            if (!followersResult.failed) {
                setFollowersCount(followersResult.friends.length); // Set followers count to the length of the returned list
            } else {
                console.error("Failed to fetch followers");
            }
        } catch (error) {
            console.error("Error fetching following and followers:", error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            // Call fetchFollowingAndFollowers every time the screen is focused
            fetchFollowingAndFollowers();

            return () => {
            };
        }, [currentUser])
    );

    // Function to fetch posts specifically for the logged-in user
    const fetchPostsForUser = async () => {
        setIsLoading(true);
        if (!currentUser) return;

        const result = await fetchUserPosts(currentUser);
        if (!result.failed) {
            let posts = result.posts;
            const otdPromises = posts.map(async post => {
                const user_res = await getUser(post.username);
                if (user_res.failed) {
                    console.error({"Failed to fetch user:": post.username});
                    return; // Skip this post or handle error appropriately
                }

                let user = user_res.user[0];
                post.pfp = user.profile_pic;
                post.name = user.first_name + ' ' + user.last_name;
                post.username_temp = user.username;

                // Fetch OTD details only if needed
                const otd = await fetchOTDForPost(post.otd_id);
                if (otd) {
                    post.category = otd[0].name;
                    post.emoji = otd[0].emoji;
                }
            });

            // Wait for all OTD details to be fetched and assigned
            await Promise.all(otdPromises);
            setUserPosts(posts);
            setIsLoading(false);
        } else {
            console.error("Failed to fetch posts for user");
            setIsLoading(false);
        }
    };

    // Function to fetch OTD based on otd_id
    const fetchOTDForPost = async (otd_id) => {
        if (otdCache.current[otd_id]) {
            return otdCache.current[otd_id];  // Return cached data if available
        }

        const otdResponse = await getOTD(otd_id);
        if (!otdResponse.failed) {
            otdCache.current[otd_id] = otdResponse.otd;  // Cache the fetched data
            return otdResponse.otd;
        } else {
            console.error("Failed to fetch OTD:", otdResponse.error);
            return null;
        }
    };


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUser(currentUser);
                if (res.failed) {
                    console.error("Failed to fetch user");
                    return;
                }
                //console.log({"fetched user:": res.user});
                await setUser(res.user[0]);
                //console.log({"user data": user});
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
        fetchPostsForUser();
    }, [currentUser, refreshTrigger]);

    const handleEditProfile = () => {
        setModalVisible(false);
        setEditProfileVisible(true);
    };

    const handleLogout = () => {
        setIsBottomBarVisible(false);
        setModalVisible(false);
        setCurrentUser(null);
        navigation.navigate('Sign In');
        changeTab("Sign In");
        navigation.reset({
            index: 0,
            routes: [{ name: 'Sign In' }],
        });
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.headerContainer}>
                <Text>             </Text>
                <Text style={styles.headerText}>otd</Text>
                <TouchableOpacity style={styles.settingsButton} onPress={() => setModalVisible(true)}>
                    <Icon name="cog" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.profileContainer}>
                {user ? <Image
                    style={styles.profileImage}
                    source={{ uri: user.profile_pic }}
                /> : null}
                <Text style={styles.profileName}>{user ? user.first_name + ' ' + user.last_name : null}</Text>
                <Text style={styles.profileHandle}>@{user ? user.username : null}</Text>
                <Text style={styles.location}>
                    {user ? user.location : null}
                </Text>
                <Text style={styles.profileDescription}>
                    {user ? user.bio : null}
                </Text>
                <View style={styles.profileStats}>
                <TouchableOpacity
                style={styles.statsBox}
                onPress={() => navigation.navigate('Followers Page', { username: currentUser })} >
                <Text style={styles.statsNumber}>{followersCount}</Text>
                <Text style={styles.statsLabel}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statsBox}
            onPress={() => navigation.navigate('Following Page', { username: currentUser })} >
                <Text style={styles.statsNumber}>{followingCount}</Text>
                <Text style={styles.statsLabel}>Following</Text>
            </TouchableOpacity>
        </View>
                
            </View>
            <View style={styles.sectionContainer}>

                <Text style={styles.badges}>🤳 Selfie of the Day</Text>
                <Text style={styles.badges}>: 1 times most upvoted globally!</Text>
            </View>
            <View style={styles.sectionContainer}>

                <Text style={styles.badges}>🎵 Song of the Day</Text>
                <Text style={styles.badges}>: 10 times most upvoted among friends!</Text>
            </View>


            <View>
    {isLoading ? (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#05452b" />
        </View>
    ) : (
        <View>
            {userPosts.length > 0 ? (
                userPosts.map((item, index) => (
                    <FeedItemProfiles
                        key={index}
                        postId={item.id}
                        pfp={item.pfp}
                        name={item.name}
                        username={item.username}
                        category={item.category}
                        text={item.text}
                        image={item.image}
                        emoji={item.emoji}
                        num_likes={item.num_likes}
                        num_comments={item.num_comments}
                        created_at={item.created_at}
                        currentUsername={currentUser}
                        onDelete={() => setRefreshTrigger(prev => !prev)}
                    />
                ))
            ) : (
                <Text style={styles.noPostsText}>Loading or you have no posts!</Text>
            )}
        </View>
    )}
</View>


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonOption]}
                            onPress={handleEditProfile}
                        >
                            <Text style={styles.textStyle}>Edit Profile</Text>
                        </Pressable>
                        <Pressable style={[styles.button, styles.buttonOption]} 
                        onPress={showChangeProfilePicOptions}>
            <Text style={styles.textStyle}> Change Profile Picture</Text>
        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonOption]}
                            onPress={handleLogout}
                        >
                            <Text style={styles.textStyle}>Logout</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <EditProfileModal
                visible={editProfileVisible}
                onClose={() => setEditProfileVisible(false)}
                onUpdateUser={(updatedUser) => setUser(updatedUser)} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: 'black',
        marginBottom: 80
    },

    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
    },

    headerText: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#05452b'
    },

    settingsButton: {
        padding: 10,
        borderRadius: 30,
        marginRight: 10,
    },

    profileContainer: {
        alignItems: 'center',
        padding: 10,
    },

    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },

    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white'
    },

    profileHandle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'green',
    },

    profileDescription: {
        textAlign: 'center',
        marginVertical: 10,
        color: 'white'
    },

    profileStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 15,
    },

    statsBox: {
        alignItems: 'center',
        flex: 1,
    },

    statsNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#05452b'
    },

    statsLabel: {
        fontSize: 16,
        color: 'grey',
    },

    sectionContainer: {
        flexDirection: 'row',
        padding: 20,
        borderTopColor: 'lightgrey',

        borderBottomColor: 'lightgrey',
  
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },

    modalView: {
        margin: 20,
        backgroundColor: '#121212',
        borderWidth: 1,
        borderColor: "grey",
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    button: {
        width: 300,
        padding: 10,
        elevation: 2,
        marginBottom: 10,
    },

    buttonOption: {
        backgroundColor: '#2196F3',
    },

    buttonClose: {
        backgroundColor: '#ff6f61',
    },

    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },

    location: {
        marginTop: 7,
        marginBottom: 13,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Helvetica-Oblique',
        fontSize: 13,
    },

    noPostsText: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white'
    },

    badges: {
        color: "white"
    }

});

export default HomePage;