// Defines the main feed component integrating navigation and top bar for toggling between Friends and Global feeds.

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons.js'
import FeedStack from "./Feed-Navigator.js"

const TopBar = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('FriendsFeed');

    return (
        <View style={styles.topBar}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'FriendsFeed' ? styles.activeTab : null]}
                onPress={() => {
                    navigation.navigate('FriendsFeed');
                    setActiveTab('FriendsFeed');
                }}>
                <Icon name='people' size={25}></Icon>
                <Text>Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'GlobalFeed' ? styles.activeTab : null]}
                onPress={() => {
                    navigation.navigate('GlobalFeed');
                    setActiveTab('GlobalFeed');
                }}>
                <Icon name='earth' size={25}></Icon>
                <Text>Everyone</Text>
            </TouchableOpacity>
        </View>
    );
}

const FeedPage = () => {
    return (
        <NavigationContainer independent={true}>
            <View style={styles.container}>
                <FeedStack/>
                <TopBar/>
            </View>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 20,
    },

    activeTab: {
        borderBottomWidth: 2, 
        borderBottomColor: 'black', 
    },

    topBar: {
        position: "absolute",
        top: 0,
        flexDirection: "row",
        backgroundColor: 'white'
    },

    container: {
        flex: 1,
        height: '100%',
    },
});

export default FeedPage;
