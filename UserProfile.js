// Profile view screen that displays detailed information about a specific user, including options to follow or unfollow, and navigation to their followers and following lists.

import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import { getUser, getFriendships, getFollowers, checkIfFollowing, followUser, unfollowUser, fetchUserPosts, getOTD } from './database';
import { UserContext } from './userContext'
import FeedItem from './feed/FeedItem';


const UserProfilePage = ({ route, navigation }) => {
    const { username } = route.params;
    const [user, setUser] = useState(null);
    const [followingCount, setFollowingCount] = useState(0);
    const [followersCount, setFollowersCount] = useState(0);
    const { currentUser } = useContext(UserContext);
    const [isFollowing, setIsFollowing] = useState(false);
    const [userPosts, setUserPosts] = useState([]);
    const otdCache = useRef({});
    const [isLoading, setIsLoading] = useState(true);


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

        // Function to fetch posts specifically for the logged-in user
        const fetchPostsForUser = async () => {
            setIsLoading(true);
            if (!username) return;
    
            const result = await fetchUserPosts(username);
            if (!result.failed) {
                let posts = result.posts;
                const user_res = await getUser(username);
                    if (user_res.failed) {
                        console.error({"Failed to fetch user:": post.username});
                        return; // Skip this post or handle error appropriately
                    }

                const otdPromises = posts.map(async post => {
                   
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
        const fetchUserProfile = async () => {
            const response = await getUser(username);
            if (!response.failed) {
                setUser(response.user[0]);
            }
        };
        fetchUserProfile();

        fetchFollowingAndFollowers();
        fetchPostsForUser();
        
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
                <TouchableOpacity style={[styles.followButton, { backgroundColor: isFollowing ? 'grey' : '#05452b'}]} onPress={toggleFollow}>
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

            

                    <View>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#05452b" />
                </View>
            ) : (
                <View>
                    {userPosts.length > 0 ? (
                        userPosts.map((item, index) => (
                            <FeedItem
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
                            />
                        ))
                    ) : (
                        <Text style={styles.noPostsText}>Loading or you have no posts!</Text>
                    )}
                </View>
            )}
        </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({


    followButton: {
        marginTop: 10,
        backgroundColor: '#05452b',
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
        backgroundColor: 'black',
        marginBottom: 80
    },

    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
        backgroundColor: "black",
    },

    headerText: {
        fontSize: 34,
        fontWeight: 'bold',
        color: "#05452b",
    },

    profileContainer: {
        alignItems: 'center',
        padding: 10,
        backgroundColor: "black",
    },

    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },

    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: "white",
    },

    profileHandle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'green',
    },

    profileDescription: {
        textAlign: 'center',
        marginVertical: 10,
        color: "white",
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
        color: "#05452b",
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
        color: "white",
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
});

export default UserProfilePage;
