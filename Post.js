// A page that showcases a variety of daily prompts for users to post responses to, with features for searching and viewing trending prompts.

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import PromptItem from './PromptItem';
import { Snackbar } from 'react-native-paper';

const PostPage = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [customPromptTitle, setCustomPromptTitle] = useState('');
    const [customPromptEmoji, setCustomPromptEmoji] = useState('');
    const [activeTab, setActiveTab] = useState('ForYou'); // Added state for managing active tab

    const promptsForYou = [
        { title: 'Song of the Day', icon: '🎵', answeredCount: 856 },
        { title: 'Outfit of the Day', icon: '👗', answeredCount: 735 },
        { title: 'Sunset of the Day', icon: '🌇', answeredCount: 375 },
        { title: 'Book of the Day', icon: '📚', answeredCount: 312 },
        { title: 'Workout of the Day', icon: '🏋️‍♂️', answeredCount: 140 },
    ];

    const promptsTrending = [
        { title: 'Song of the Day', icon: '🎵', answeredCount: 856 },
        { title: 'Outfit of the Day', icon: '👗', answeredCount: 735 },
        { title: 'Selfie of the Day', icon: '🤳', answeredCount: 609 },
        { title: "Movie of the Day", icon: '🍿', answeredCount: 599 },
        { title: 'Painting of the Day', icon: '🎨', answeredCount: 512 },
        { title: 'Quote of the Day', icon: '💬', answeredCount: 448 },
        { title: 'Sunset of the Day', icon: '🌇', answeredCount: 375 },
        { title: 'Book of the Day', icon: '📚', answeredCount: 312 },
        { title: "Travel View of the Day", icon: '🌍', answeredCount: 301 },
        { title: 'Recipe of the Day', icon: '🍲', answeredCount: 256 },
        { title: "Dog of the Day", icon: '🐶', answeredCount: 233 },
        { title: 'Joke of the Day', icon: '🤣', answeredCount: 213 },
        { title: "Sunrise of the Day", icon: '🌅', answeredCount: 197 },
        { title: 'Glizzy of the Day', icon: '🌭', answeredCount: 174 },
        { title: 'Workout of the Day', icon: '🏋️‍♂️', answeredCount: 140 },
        { title: "Thought of the Day", icon: '💭', answeredCount: 112 },
        { title: "Cat of the Day", icon: '🐱', answeredCount: 108 },
        { title: "Sports Highlight of the Day", icon: '⚽', answeredCount: 99 },
        { title: "Throwback of the Day", icon: '🎞️', answeredCount: 95 },
        { title: "Struggle of the Day", icon: '😩', answeredCount: 91 },
        { title: "Pet of the Day", icon: '🐾', answeredCount: 74 },
        { title: "Architectural Marvel of the Day", icon: '🏛️', answeredCount: 66 },
        { title: "Baby of the Day", icon: '👶', answeredCount: 59 },
        { title: "Couple of the Day", icon: '👩‍❤️‍👨', answeredCount: 57 },
        { title: "Good Dead of the Day", icon: '😇', answeredCount: 50 },
        { title: "Meal of the Day", icon: '🍽️', answeredCount: 41 },
        { title: "News of the Day", icon: '📰', answeredCount: 36 },
        { title: "Plant of the Day", icon: '🪴', answeredCount: 34 },
        { title: "Snack of the Day", icon: '🍓', answeredCount: 33 },
        { title: "Coffee of the Day", icon: '☕', answeredCount: 30 },
        { title: "Thirst Trap of the Day", icon: '🔥', answeredCount: 30 },
        { title: "Mood of the Day", icon: '😊', answeredCount: 29 },
        { title: "Pride of the Day", icon: '🌈', answeredCount: 26 },
        { title: "Achievement of the Day", icon: '🏆', answeredCount: 25 },
        { title: "Laugh of the Day", icon: '😂', answeredCount: 24 },
        { title: "Trivia of the Day", icon: '🧠', answeredCount: 19 },
        { title: "Self-Care Act of the Day", icon: '🧘', answeredCount: 15 },
        { title: "New Tech of the Day", icon: '📱', answeredCount: 12 },
        { title: "Life Hack of the Day", icon: '🛠️', answeredCount: 6 },
        { title: "Lesson of the Day", icon: '✏️', answeredCount: 4 },
    ];

    const getPrompts = () => {
        return activeTab === 'ForYou' ? promptsForYou : promptsTrending;
    };

    const [promptOfTheDay, setPromptOfTheDay] = useState({
            title: 'Plant of the Day',
            icon: '🪴',
            answeredCount: 34, // Example answered count
    });

    // This function updates the search query state as the user types in the search bar
    const handleSearch = text => {
        setSearchQuery(text);
    };

    const getFilteredPrompts = () => {
        const currentPrompts = getPrompts();
        const filtered = searchQuery.trim() === ''
            ? currentPrompts
            : currentPrompts.filter(prompt =>
                prompt.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        return filtered;
    };
    
    return (
        <ScrollView style={styles.container}>
            {/* Search Bar Container */}
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Search OTD"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

              {/* Prompt of the Day Container */}
              <View style={styles.promptOfTheDayContainer}>
                <Text style={styles.promptOfTheDayHeader}>Today</Text>
                <PromptItem
                    title={promptOfTheDay.title}
                    icon={promptOfTheDay.icon}
                    answeredCount={promptOfTheDay.answeredCount}
                    navigation={navigation}
                />
            </View>

            {/* Prompts List Container */}
            <View style={styles.promptsContainer}>

            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'ForYou' ? styles.activeTab : null]}
                    onPress={() => setActiveTab('ForYou')}>
                    <Text style={styles.promptOfTheDayHeader}>For You</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Trending' ? styles.activeTab : null]}
                    onPress={() => setActiveTab('Trending')}>
                    <Text style={styles.promptOfTheDayHeader}>Trending</Text>
                </TouchableOpacity>
            </View>

                {getFilteredPrompts().map((prompt, index) => (
                    <PromptItem
                        key={index}
                        title={prompt.title}
                        icon={prompt.icon}
                        answeredCount={prompt.answeredCount}
                        navigation={navigation}
                    />
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },

    searchContainer: {
        padding: 10,
        backgroundColor: 'white',
    },

    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
    },

    promptsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 3,
        backgroundColor: 'white',
        fontSize: 22
    },

    createCustomPromptContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: 'white',
    },

    customPromptInput: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        marginRight: 10,
    },

    customPromptEmojiInput: {
        width: 60,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        marginRight: 10,
        textAlign: 'center',
    },

    createPromptButton: {
        backgroundColor: 'blue',
        borderRadius: 10,
        padding: 10,
    },

    createPromptButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },

    promptsContainer: {
        backgroundColor: 'white',
    },

    promptOfTheDayContainer: {
        backgroundColor: 'blanchedalmond',
        marginLeft: 10,
        marginTop: 3,
    },

    promptOfTheDayHeader: {
        fontSize: 22,
        fontWeight: 'bold',
    },

    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },

    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },

    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: 'black',
    },
});

export default PostPage;