// Profile view screen that displays detailed information about a specific user, including options to follow or unfollow, and navigation to their followers and following lists.

import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import { getUser, getFriendships, getFollowers, checkIfFollowing, followUser, unfollowUser } from './database';
import { UserContext } from './userContext'

const UserProfilePage = ({ route, navigation }) => {
    const { username } = route.params;
    const [user, setUser] = useState(null);
    const [followingCount, setFollowingCount] = useState(0);
    const [followersCount, setFollowersCount] = useState(0);
    const { currentUser } = useContext(UserContext);
    const [isFollowing, setIsFollowing] = useState(false);

    // Fetch following and followers count
    const fetchFollowingAndFollowers = async () => {
        const followingResult = await getFriendships(username);
        const followersResult = await getFollowers(username);

        if (!followingResult.failed) {
            setFollowingCount(followingResult.friends.length);
        }

        if (!followersResult.failed) {
            setFollowersCount(followersResult.friends.length);
        }
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            const response = await getUser(username);
            if (!response.failed) {
                setUser(response.user[0]);
            }
        };
        fetchUserProfile();

        fetchFollowingAndFollowers();
        
        // Check if currentUser is following the viewed profile
        const checkFollowingStatus = async () => {
        const result = await checkIfFollowing(currentUser, username);
        setIsFollowing(result);
    };

    checkFollowingStatus();
    }, [username, currentUser]);

    const toggleFollow = async () => {
        if (isFollowing) {
            await unfollowUser(currentUser, username); 
        } else {
            await followUser(currentUser, username); 
        }
        setIsFollowing(!isFollowing);
    
        // Update followers count
        fetchFollowingAndFollowers();
    };

    if (!user) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.headerContainer}>
                <Text>             </Text>
                <Text style={styles.headerText}>otd</Text>
                <Text>             </Text>
            </View>
            <View style={styles.profileContainer}>
                <Image style={styles.profileImage} source={{ uri: user.profile_pic }} />
                <Text style={styles.profileName}>{user.first_name} {user.last_name}</Text>
                <Text style={styles.profileHandle}>@{user.username}</Text>
                <Text style={styles.profileLocation}>{user.location}</Text>
                <Text style={styles.profileDescription}>{user.bio}</Text>
                {/* Follow Button */}
                <TouchableOpacity style={styles.followButton} onPress={toggleFollow}>
                    <Text style={styles.followButtonText}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
                </TouchableOpacity>
                {/* Following and Followers */}
                <View style={styles.profileStats}>
                <TouchableOpacity
                    style={styles.statsBox}
                    onPress={() => navigation.navigate('User Followers Page', { username: user })} >
                    <Text style={styles.statsNumber}>{followersCount}</Text>
                    <Text style={styles.statsLabel}>Followers</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statsBox}
                onPress={() => navigation.navigate('User Following Page', { username: user })} >
                    <Text style={styles.statsNumber}>{followingCount}</Text>
                    <Text style={styles.statsLabel}>Following</Text>
                </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    followButton: {
        marginTop: 10,
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },

    followButtonText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },

    scrollView: {
        backgroundColor: 'white',
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
    },

    profileHandle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'blue',
    },

    profileDescription: {
        textAlign: 'center',
        marginVertical: 10,
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
    },

    statsLabel: {
        fontSize: 16,
        color: 'grey',
    },

    sectionContainer: {
        flexDirection: 'row',
        padding: 20,
        borderBottomWidth: 1,
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
        backgroundColor: 'white',
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

    profileLocation: {
        marginTop: 7,
        marginBottom: 13,
        textAlign: 'center',
    },
});

export default UserProfilePage;
