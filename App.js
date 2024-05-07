// Root component for the app, managing navigation, user session, and global state, including sign-in flow and error messaging.

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import AppStack from "./Stack-Navigator.js"
import Icon from 'react-native-vector-icons/Ionicons.js'
import { UserContext, UserProvider } from './userContext.js';
import SignIn from './SignIn.js';
import ErrorMessage from './ErrorMessage.js';
import { navigationRef } from './NavigationRef';
import { TabProvider, useTab } from './TabContext';

const AppBottomBar = () => {
  const navigation = useNavigation();
  const { activeTab, setActiveTab, changeTab } = useTab();
  
  return (
    <View style={styles.bottomBar}> 
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'Feed' && styles.activeTab]}
        onPress={() => {
          navigation.navigate('Feed');
          changeTab('Feed');
          navigationRef.current.reset({
            index: 0,
            routes: [{ name: 'Feed' }],
        }); 
        }}>
        <Icon name='list' size={25} color="#FFFFFF"></Icon>
        <Text style={styles.tabText}>Feed</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'Post' && styles.activeTab]}
        onPress={() => {
          navigation.navigate('Post');
          changeTab('Post');
          navigationRef.current.reset({
            index: 0,
            routes: [{ name: 'Post' }],
        }); 
        }}>
        <Icon name='add-circle' size={25} color="#FFFFFF"></Icon>
        <Text style={styles.tabText}>Post</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'Search' && styles.activeTab]}
        onPress={() => {
          navigation.navigate('Search');
          changeTab('Search');
          navigationRef.current.reset({
            index: 0,
            routes: [{ name: 'Search' }],
        }); 
          
        }}>
        <Icon name='search' size={25} color="#FFFFFF"></Icon>
        <Text style={styles.tabText}>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'Profile' && styles.activeTab]}
        onPress={() => {
          navigation.navigate('Profile');
          changeTab('Profile');
          navigationRef.current.reset({
            index: 0,
            routes: [{ name: 'Profile' }],
        }); 
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
  const [activeTab, setActiveTab] = useState('Register');
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <UserProvider>
      <TabProvider>
        <NavigationContainer ref={navigationRef}>
          {/* Conditionally render SignIn or the main app content */}
          {activeTab === "Register" || activeTab === "Sign In" ? (
            <SignIn setActiveTab={setActiveTab} setErrorMessage={setErrorMessage} />
          ) : (
            <View style={styles.container}>
              <AppStack />
              <BottomBarComponent />
            </View>
          )}
          {errorMessage !== "" && (
            <ErrorMessage message={errorMessage} setErrorMessage={setErrorMessage} />
          )}
        </NavigationContainer>
      </TabProvider>
    </UserProvider>
  );
}

function BottomBarComponent() {
  const { activeTab } = useTab();
  const showBottomBar = activeTab !== 'Register' && activeTab !== 'Sign In';  
  return showBottomBar && <AppBottomBar />;
}

