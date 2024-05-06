// A search interface for finding users by username prefix, displaying search results with navigation to user profiles.

import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { searchUsersByUsernamePrefix } from './database'; 
import { UserContext } from './userContext';
import { useTab } from './TabContext';


const MailPage = ( {navigation} ) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { currentUser } = useContext(UserContext);
    const { changeTab } = useTab();

    const handleSearchChange = async (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setSearchResults([]);
        } else {
            try {
                const response = await searchUsersByUsernamePrefix(query.trim());
                if (!response.failed) {
                    setSearchResults(response.users); 
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.error('Search failed:', error);
                setSearchResults([]);
            }
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Search"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                    placeholderTextColor="lightgrey"
                />
            </View>
            <View style={styles.promptsContainer}>
            {searchResults.map((user, index) => (
                <TouchableOpacity key={index} 
                onPress={() => {
                    if (user.username === currentUser) {
                        changeTab('Profile');
                        navigation.navigate('Profile');
                    } else {
                        navigation.navigate('User Profile Page', { username: user.username });
                    }
                }}
                >
                    <View style={styles.userItem}>
                        <Image source={{ uri: user.profile_pic || 'default_profile_pic_uri' }} style={styles.profilePic} />
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{`${user.first_name} ${user.last_name}`}</Text>
                            <Text style={styles.userHandle}>{`@${user.username}`}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },

    searchContainer: {
        marginTop: 20,
        paddingHorizontal: 10,
    },

    searchInput: {
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        color: 'white'
    },

    promptsContainer: {
        marginTop: 20,
    },

    userItem: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },

    profilePic: {
        width: 50, 
        height: 50, 
        borderRadius: 25, // Half the width/height to make it circular
        marginRight: 10,
    },

    userInfo: {
        justifyContent: 'center',
    },

    userName: {
        fontWeight: 'bold',
        color: 'white'
    },

    userHandle: {
        color: 'grey',
    },
});

export default MailPage;
