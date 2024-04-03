// A screen dedicated to displaying the followers of a specific user, leveraging data from the database to populate the list.

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { getFollowersDetails } from './database';

const UserFollowersPage = ({ navigation, route }) => {
    const { username } = route.params.username;
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        const fetchFollowers = async () => {
            try { 
                //console.log(username)
                const result = await getFollowersDetails(username);
                //console.log(result)
                if (!result.failed) {

                    setFollowers(result.followers);
                }
            } catch (error) {
                console.error("Error fetching followers:", error);
            }
        };
    
        fetchFollowers();
    }, [username]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
            
                <Text style={styles.headerTitle}>Followers</Text>
                </View>
            {followers.map((followers, index) => (
                <View key={index} style={styles.followersItem}>
                    <Image 
                        source={{ uri: followers.profile_pic || 'default_image_placeholder' }}
                        style={styles.profileImage}
                    />
                    <View style={styles.followersDetails}>
                        <Text style={styles.followersName}>{followers.first_name} {followers.last_name}</Text>
                        <Text style={styles.followersUsername}>@{followers.username}</Text>
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
        backgroundColor: 'red',
        borderRadius: 15,
    },

    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default UserFollowersPage;