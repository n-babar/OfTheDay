// A screen dedicated to displaying the followers of a specific user, leveraging data from the database to populate the list.

import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { getFollowersDetails, followUser, unfollowUser, checkIfFollowing } from './database';
import { UserContext } from './userContext';
import { useTab } from './TabContext';

const UserFollowersPage = ({ navigation, route }) => {
    const { username } = route.params; // Assuming this is correctly extracting the username
    const [followers, setFollowers] = useState([]);
    const { currentUser } = useContext(UserContext);
    const { changeTab } = useTab();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFollowers = async () => {
            setIsLoading(true);
            try {
                const result = await getFollowersDetails(username.username);
                if (!result.failed) {
                    const followersStatusPromises = result.followers.map(async follower => ({
                        ...follower,
                        isFollowing: await checkIfFollowing(currentUser, follower.username)
                    }));
                    Promise.all(followersStatusPromises)
                        .then(updatedFollowers => {
                            updatedFollowers.sort((a, b) => {
                                if (a.first_name.toLowerCase() === b.first_name.toLowerCase()) {
                                    // If first names are equal, sort by last name
                                    return a.last_name.toLowerCase().localeCompare(b.last_name.toLowerCase());
                                }
                                return a.first_name.toLowerCase().localeCompare(b.first_name.toLowerCase());
                            });
                            setFollowers(updatedFollowers);
                        })
                        .catch(error => console.error('Error setting follow statuses:', error));
                }
            } catch (error) {
                console.error("Error fetching followers:", error);
            }
            setIsLoading(false);
        };

        fetchFollowers();
    }, [username, currentUser]);

    const handleFollowToggle = async (follower) => {
        const isFollowing = follower.isFollowing;
        if (isFollowing) {
            await unfollowUser(currentUser, follower.username);
        } else {
            await followUser(currentUser, follower.username);
        }
        setFollowers(followers.map(followerUser => {
            if (followerUser.username === follower.username) {
                return { ...followerUser, isFollowing: !isFollowing };
            }
            return followerUser;
        }));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Followers</Text>
            </View>
            {isLoading ? (
                <ActivityIndicator size="large" color="#05452b" />  // Display the loading indicator
            ) : (
            followers.map((follower, index) => (
                <View key={index} style={styles.followersItem}>
                    <TouchableOpacity onPress={() => {
                    if (follower.username === currentUser) {
                        changeTab('Profile');
                        navigation.navigate('Profile');
                    } else {
                        navigation.navigate('User Profile Page', { username: follower.username });
                    }
                }}
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Image 
                        source={{ uri: follower.profile_pic || 'default_image_placeholder' }}
                        style={styles.profileImage}
                    />
                    <View style={styles.followersDetails}>
                        <Text style={styles.followersName}>{follower.first_name} {follower.last_name}</Text>
                        <Text style={styles.followersUsername}>@{follower.username}</Text>
                    </View>
                    </TouchableOpacity>
                    {follower.username !== currentUser && (
                        <TouchableOpacity
                            style={[styles.removeButton, { backgroundColor: follower.isFollowing ? 'grey' : '#05452b'}]}
                            onPress={() => handleFollowToggle(follower)}
                        >
                            <Text style={styles.removeButtonText}>{follower.isFollowing ? 'Unfollow' : 'Follow'}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "white",
    },
    followersItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'space-between',
    },
    followersDetails: {
        flex: 1,
        marginLeft: 10,
    },
    followersName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: "white",
    },
    followersUsername: {
        color: 'grey',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    removeButton: {
        padding: 8,
        borderRadius: 15,
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default UserFollowersPage;
