// Screen component to display users that the current user is following with functionality to unfollow.

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { getFollowingDetails, unfollowUser } from './database';

const FollowingPage = ({ navigation, route }) => {
    const { username } = route.params;
    const [following, setFollowing] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFollowing();
    }, [username]);

    const fetchFollowing = async () => {
        setIsLoading(true);
        try { 
            const result = await getFollowingDetails(username);
            if (!result.failed) {
                // Sort the following list by first name and last name
                const sortedFollowing = result.following.sort((a, b) => {
                    if (a.first_name.toLowerCase() === b.first_name.toLowerCase()) {
                        // If first names are equal, sort by last name
                        return a.last_name.toLowerCase().localeCompare(b.last_name.toLowerCase());
                    }
                    return a.first_name.toLowerCase().localeCompare(b.first_name.toLowerCase());
                });
                setFollowing(sortedFollowing);
            }
        } catch (error) {
            console.error("Error fetching following:", error);
        }
        setIsLoading(false);
    };

    const handleUnfollow = async (unfollowUsername) => {
        const success = await unfollowUser(username, unfollowUsername);
        if (success) {
            // Remove the unfollowed user from the following list in the state
            setFollowing(following.filter(user => user.username !== unfollowUsername));
            
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Following</Text>
            </View>
            {isLoading ? (
                <ActivityIndicator size="large" color="#05452b" />  // Display the loading indicator
            ) : (
                following.map((followedUser, index) => (
                    <View key={index} style={styles.followingItem}>
                        <TouchableOpacity onPress={() =>  navigation.navigate('User Profile Page', { username: followedUser.username })} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Image 
                            source={{ uri: followedUser.profile_pic || 'default_image_placeholder' }}
                            style={styles.profileImage}
                        />
                        <View style={styles.followingDetails}>
                            <Text style={styles.followingName}>{followedUser.first_name} {followedUser.last_name}</Text>
                            <Text style={styles.followingUsername}>@{followedUser.username}</Text>
                        </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => handleUnfollow(followedUser.username)}
                        >
                            <Text style={styles.removeButtonText}>Unfollow</Text>
                        </TouchableOpacity>
                    </View>
                ))
            )}

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

export default FollowingPage;