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
                <Icon name='people' size={25} color="#FFFFFF"></Icon>
                <Text style={{ color: '#FFFFFF' }}>Following</Text> 
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'ForYouFeed' ? styles.activeTab : null]}
                onPress={() => {
                    navigation.navigate('ForYouFeed');
                    setActiveTab('ForYouFeed');
                }}>
                <Icon name='happy-outline' size={25} color="#FFFFFF"></Icon>
                <Text style={{ color: '#FFFFFF' }}>For You</Text> 
            </TouchableOpacity>
            {/* <TouchableOpacity
                style={[styles.tab, activeTab === 'GlobalFeed' ? styles.activeTab : null]}
                onPress={() => {
                    navigation.navigate('GlobalFeed');
                    setActiveTab('GlobalFeed');
                }}>
                <Icon name='earth' size={25}></Icon>
                <Text>Everyone</Text>
            </TouchableOpacity> */}
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
      backgroundColor: '#121212', // Changed to dark background color
    },
  
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: '#FFFFFF', // Changed to purple color for the active indicator
    },
  
    topBar: {
      position: "absolute",
      top: 0,
      flexDirection: "row",
      backgroundColor: '#121212', // Changed to dark background color
    },
  
    container: {
      flex: 1,
      height: '100%',
      backgroundColor: '#121212', // Changed to dark background color
    },

    
  });

export default FeedPage;
