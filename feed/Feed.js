// Defines the main feed component integrating navigation and top bar for toggling between Friends and Global feeds.

import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import FriendsFeedPage from './FriendsFeed.js';
import ForYouFeedPage from './ForYouFeed.js';
import Icon from 'react-native-vector-icons/Ionicons';

const TopBar = ({ setActiveTab, activeTab }) => {
    return (
        <View style={styles.topBar}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'FriendsFeed' ? styles.activeTab : null]}
                onPress={() => setActiveTab('FriendsFeed')}>
                <Icon name='people' size={25} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF' }}>Following</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'ForYouFeed' ? styles.activeTab : null]}
                onPress={() => setActiveTab('ForYouFeed')}>
                <Icon name='happy-outline' size={25} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF' }}>For You</Text>
            </TouchableOpacity>
        </View>
    );
};

const FeedPage = ( {navigation} ) => {
    const [activeTab, setActiveTab] = useState('FriendsFeed');

    // Determine which component to render based on the active tab
    let ActiveComponent = activeTab === 'FriendsFeed' ? FriendsFeedPage : ForYouFeedPage;

    return (
        <View style={styles.container}>
            <TopBar setActiveTab={setActiveTab} activeTab={activeTab} />
            <ActiveComponent navigation={navigation} />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: '#121212', // Dark theme background color
    },

    topBar: {
        position: "absolute",
        top: 0,
        flexDirection: "row",
        backgroundColor: '#121212', // Dark theme background color
        width: '100%', // Ensure it covers the full width
    },
    tab: {
        paddingVertical: 0,
        flex: 1,
        alignItems: 'center',
        paddingVertical: 18,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#05452b', // Active indicator color
    },
});

export default FeedPage;
