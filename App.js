// Root component for the app, managing navigation, user session, and global state, including sign-in flow and error messaging.

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import AppStack from "./Stack-Navigator.js"
import Icon from 'react-native-vector-icons/Ionicons.js'
import { UserContext, UserProvider } from './userContext.js';
import SignIn from './SignIn.js';
import ErrorMessage from './ErrorMessage.js';

const AppBottomBar = ({ activeTab, setActiveTab }) => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.bottomBar}> 
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'Feed' && styles.activeTab]}
        onPress={() => {
          navigation.navigate('Feed');
          setActiveTab('Feed');
        }}>
        <Icon name='list' size={25} color="#FFFFFF"></Icon>
        <Text style={styles.tabText}>Feed</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'Post' && styles.activeTab]}
        onPress={() => {
          navigation.navigate('Post');
          setActiveTab('Post');
        }}>
        <Icon name='add-circle' size={25} color="#FFFFFF"></Icon>
        <Text style={styles.tabText}>Post</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'Search' && styles.activeTab]}
        onPress={() => {
          navigation.navigate('Search', { setActiveTab: setActiveTab });
          setActiveTab('Search');
        }}>
        <Icon name='search' size={25} color="#FFFFFF"></Icon>
        <Text style={styles.tabText}>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'Profile' && styles.activeTab]}
        onPress={() => {
          navigation.navigate('Profile');
          setActiveTab('Profile');
        }}>
        <Icon name='person' size={25} color="#FFFFFF"></Icon>
        <Text style={styles.tabText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#121212', // new background color for tabs
  },

  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#05452b', // new accent color for active tab
  },

  container: {
    flex: 1,
    height: '100%',
    backgroundColor: '#121212', // new background color for container
  },

  topBar: {
    position: "absolute",
    justifyContent: 'center',
    top: 0,
    flexDirection: "row",
    backgroundColor: '#121212', // new background color for top bar
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    backgroundColor: '#121212', // new background color for bottom bar
  },

  // New style for text to ensure it's visible on the dark background
  text: {
    color: '#FFFFFF', // new text color for better contrast
  },

  tabText: {
    color: '#FFFFFF', // new text color for better contrast
  },

});

export default function App() {
  const [activeTab, setActiveTab] = useState('Sign In');
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log({"current errorMessage": errorMessage});
  }, [errorMessage]);

  return (
    <UserProvider>
      <NavigationContainer>
      {activeTab == "Sign In" && (<SignIn setActiveTab={setActiveTab} setErrorMessage={setErrorMessage}></SignIn>)}
      {activeTab != "Sign In" && (<View style={styles.container}>
        <AppStack />
        <AppBottomBar activeTab={activeTab} setActiveTab={setActiveTab}/>
      </View>)}
      {errorMessage != "" && (<ErrorMessage message={errorMessage} setErrorMessage={setErrorMessage}/>)}
    </NavigationContainer>
    </UserProvider>
  );
}