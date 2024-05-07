// A screen designed to show the profiles of users that a specific user is following, with the ability to view detailed profiles.

import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { getFollowingDetails, followUser, unfollowUser, checkIfFollowing } from './database';
import { UserContext } from './userContext'
import { useTab } from './TabContext';

const UserFollowingPage = ({ navigation, route }) => {
    const { username } = route.params; // Assuming this is correctly extracting the username
    const [following, setFollowing] = useState([]);
    const { currentUser } = useContext(UserContext);
    const { changeTab } = useTab();

    useEffect(() => {
        const fetchFollowing = async () => {
            // console.log('Fetching following for:', username);
            const result = await getFollowingDetails(username.username);
            if (!result.failed && result.following) {
                const followStatusPromises = result.following.map(async user => ({
                    ...user,
                    isFollowing: await checkIfFollowing(currentUser, user.username)
                }));

                Promise.all(followStatusPromises)
                    .then(updatedFollowing => {
                        // console.log('Updated following:', updatedFollowing);
                        updatedFollowing.sort((a, b) => {
                            if (a.first_name.toLowerCase() === b.first_name.toLowerCase()) {
                                // If first names are equal, sort by last name
                                return a.last_name.toLowerCase().localeCompare(b.last_name.toLowerCase());
                            }
                            return a.first_name.toLowerCase().localeCompare(b.first_name.toLowerCase());
                        });
                        setFollowing(updatedFollowing);
                    })
                    .catch(error => console.error('Error setting follow statuses:', error));
            } else {
                console.error("Error fetching following:", result.error);
            }
        };
        fetchFollowing();
    }, [username, currentUser]); // Added currentUser dependency

    const handleFollowToggle = async (user) => {
        const isFollowing = user.isFollowing;
        if (isFollowing) {
            await unfollowUser(currentUser, user.username);
        } else {
            await followUser(currentUser, user.username);
        }
        // Update local state to reflect the change
        setFollowing(following.map(followingUser => {
            if (followingUser.username === user.username) {
                return { ...followingUser, isFollowing: !isFollowing };
            }
            return followingUser;
        }));
    };


    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Following</Text>
            </View>
            {following.map((user, index) => (
                <View key={index} style={styles.followingItem}>
                    <TouchableOpacity 
                    onPress={() => {
                        if (user.username === currentUser) {
                            changeTab('Profile');
                            navigation.navigate('Profile');
                        } else {
                            navigation.navigate('User Profile Page', { username: user.username });
                        }
                    }}
                    style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Image 
                        source={{ uri: user.profile_pic || 'default_image_placeholder' }}
                        style={styles.profileImage}
                    />
                    <View style={styles.followingDetails}>
                        <Text style={styles.followingName}>{user.first_name} {user.last_name}</Text>
                        <Text style={styles.followingUsername}>@{user.username}</Text>
                    </View>
                    </TouchableOpacity>
                    {user.username !== currentUser && (
                        <TouchableOpacity
                            style={[styles.removeButton, { backgroundColor: user.isFollowing ? 'grey' : '#05452b'}]}
                            onPress={() => handleFollowToggle(user)}
                        >
                            <Text style={styles.removeButtonText}>{user.isFollowing ? 'Unfollow' : 'Follow'}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ))}
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
    followingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'space-between',
    },
    followingDetails: {
        flex: 1,
        marginLeft: 10,
    },
    followingName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: "white",
    },
    followingUsername: {
        color: 'grey',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    removeButton: {
        padding: 8,
        backgroundColor: 'red',
        borderRadius: 15,
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default UserFollowingPage;
