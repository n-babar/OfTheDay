// Screen component displaying the list of followers for a specific user with the option to remove followers.

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { getFollowersDetails, removeFollower } from './database';

const FollowersPage = ({ navigation, route }) => {
    const { username } = route.params;
    const [followers, setFollowers] = useState([]);

    useEffect(() => {

        fetchFollowers();
    }, [username]);

    const fetchFollowers = async () => {
        try { 
            const result = await getFollowersDetails(username);
            if (!result.failed) {

                setFollowers(result.followers);
            }
        } catch (error) {
            console.error("Error fetching followers:", error);
        }
    };

    const handleRemove = async (removeUsername) => {
        const success = await removeFollower(username, removeUsername);
        if (success) {
            // Remove the unfollowed user from the following list in the state
            setFollowers(followers.filter(user => user.username !== removeUsername));
            
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
        
                <Text style={styles.headerTitle}>Followers</Text>
                </View>
            {followers.map((follower, index) => (
                <View key={index} style={styles.followerItem}>
                    <Image 
                        source={{ uri: follower.profile_pic || 'default_image_placeholder' }}
                        style={styles.profileImage}
                    />
                    <View style={styles.followerDetails}>
                        <Text style={styles.followerName}>{follower.first_name} {follower.last_name}</Text>
                        <Text style={styles.followerUsername}>@{follower.username}</Text>
                    </View>
                    <TouchableOpacity style={styles.removeButton}
                    onPress={() => handleRemove(follower.username)}
                    >
                        <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
    },

    followerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'space-between',
    },

    followerDetails: {
        flex: 1,
        marginLeft: 10, 
    },

    followerName: {
        fontWeight: 'bold',
        fontSize: 16,
    },

    followerUsername: {
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

export default FollowersPage;
