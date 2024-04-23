// A screen designed to show the profiles of users that a specific user is following, with the ability to view detailed profiles.

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { getFollowingDetails } from './database';

const UserFollowingPage = ({ navigation, route }) => {
    const { username } = route.params.username;
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        const fetchFollowing = async () => {
            try { 
                //console.log(username)
                const result = await getFollowingDetails(username);
                //console.log(result)
                if (!result.failed) {

                    setFollowing(result.following);
                }
            } catch (error) {
                console.error("Error fetching following:", error);
            }
        };
    
        fetchFollowing();
    }, [username]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
    
         
                <Text style={styles.headerTitle}>Following</Text>
                </View>
            {following.map((following, index) => (
                <View key={index} style={styles.followingItem}>
                    <Image 
                        source={{ uri: following.profile_pic || 'default_image_placeholder' }}
                        style={styles.profileImage}
                    />
                    <View style={styles.followingDetails}>
                        <Text style={styles.followingName}>{following.first_name} {following.last_name}</Text>
                        <Text style={styles.followingUsername}>@{following.username}</Text>
                    </View>
                    {/* <TouchableOpacity style={styles.removeButton}>
                        <Text style={styles.removeButtonText}>Unfollow</Text>
                    </TouchableOpacity> */}
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