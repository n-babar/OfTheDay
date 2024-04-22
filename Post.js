// A page that showcases a variety of daily prompts for users to post responses to, with features for searching and viewing trending prompts.

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import PromptItem from './PromptItem';
import { UserContext } from './userContext';
import { getAllUserFavoriteOtds, addSpecificUserOtd, getOTD, removeSpecificUserOtd } from './database';
import PromptItemTrending from './PromptItemTrending';
import PromptOTDItem from "./PromptOTDItem"

const PostPage = ({ navigation }) => {
    const { currentUser } = useContext(UserContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [favoritePrompts, setFavoritePrompts] = useState(new Set());
    const [customPromptTitle, setCustomPromptTitle] = useState('');
    const [customPromptEmoji, setCustomPromptEmoji] = useState('');
    const [activeTab, setActiveTab] = useState('ForYou');
    const [promptsForYou, setPromptsForYou] = useState([]);


    // const promptsForYou = [
    //     { title: 'Song of the Day', icon: '🎵', answeredCount: 856 },
    //     { title: 'Outfit of the Day', icon: '👗', answeredCount: 735 },
    //     { title: 'Sunset of the Day', icon: '🌇', answeredCount: 375 },
    //     { title: 'Book of the Day', icon: '📚', answeredCount: 312 },
    //     { title: 'Workout of the Day', icon: '🏋️‍♂️', answeredCount: 140 },
    // ];

    const promptsTrending = [
        { title: 'Song of the Day', icon: '🎵', answeredCount: 856, id: 2 },
        { title: 'Outfit of the Day', icon: '👗', answeredCount: 735, id: 3 },
        { title: 'Selfie of the Day', icon: '🤳', answeredCount: 609, id: 4 },
        { title: "Movie of the Day", icon: '🍿', answeredCount: 599, id: 37 },
        { title: 'Painting of the Day', icon: '🎨', answeredCount: 512, id: 5 },
        { title: 'Quote of the Day', icon: '💬', answeredCount: 448, id: 6 },
        { title: 'Sunset of the Day', icon: '🌇', answeredCount: 375, id: 1 },
        { title: 'Book of the Day', icon: '📚', answeredCount: 312, id: 7 },
        { title: "Travel View of the Day", icon: '🌍', answeredCount: 301, id: 25 },
        { title: 'Recipe of the Day', icon: '🍲', answeredCount: 256, id: 8 },
        { title: "Dog of the Day", icon: '🐶', answeredCount: 233, id: 15 },
        { title: 'Joke of the Day', icon: '🤣', answeredCount: 213, id: 9 },
        { title: "Sunrise of the Day", icon: '🌅', answeredCount: 197, id: 24 },
        { title: 'Glizzy of the Day', icon: '🌭', answeredCount: 174, id: 10 },
        { title: 'Workout of the Day', icon: '🏋️‍♂️', answeredCount: 140, id: 11 },
        { title: "Thought of the Day", icon: '💭', answeredCount: 112, id: 12 },
        { title: "Cat of the Day", icon: '🐱', answeredCount: 108, id: 33 },
        { title: "Sports Highlight of the Day", icon: '⚽', answeredCount: 99, id: 30 },
        { title: "Throwback of the Day", icon: '🎞️', answeredCount: 95, id: 40 },
        { title: "Struggle of the Day", icon: '😩', answeredCount: 91, id: 13 },
        { title: "Pet of the Day", icon: '🐾', answeredCount: 74, id: 14 },
        { title: "Architectural Marvel of the Day", icon: '🏛️', answeredCount: 66, id: 36 },
        { title: "Baby of the Day", icon: '👶', answeredCount: 59, id: 32 },
        { title: "Couple of the Day", icon: '👩‍❤️‍👨', answeredCount: 57, id: 29 },
        { title: "Good Dead of the Day", icon: '😇', answeredCount: 50, id: 16 },
        { title: "Meal of the Day", icon: '🍽️', answeredCount: 41, id: 17 },
        { title: "News of the Day", icon: '📰', answeredCount: 36, id: 31 },
        { title: "Plant of the Day", icon: '🪴', answeredCount: 34, id: 18 },
        { title: "Snack of the Day", icon: '🍓', answeredCount: 33, id: 35 },
        { title: "Coffee of the Day", icon: '☕', answeredCount: 30, id: 34 },
        { title: "Thirst Trap of the Day", icon: '🔥', answeredCount: 30, id: 27 },
        { title: "Mood of the Day", icon: '😊', answeredCount: 29, id: 19 },
        { title: "Pride of the Day", icon: '🌈', answeredCount: 26, id: 39 },
        { title: "Achievement of the Day", icon: '🏆', answeredCount: 25, id: 38 },
        { title: "Laugh of the Day", icon: '😂', answeredCount: 24, id: 20 },
        { title: "Trivia of the Day", icon: '🧠', answeredCount: 19, id: 21 },
        { title: "Self-Care Act of the Day", icon: '🧘', answeredCount: 15, id: 22 },
        { title: "New Tech of the Day", icon: '📱', answeredCount: 12, id: 23 },
        { title: "Life Hack of the Day", icon: '🛠️', answeredCount: 6, id: 26 },
        { title: "Lesson of the Day", icon: '✏️', answeredCount: 4, id: 28 },
    ];

    useEffect(() => {
        if (currentUser) {
            getAllUserFavoriteOtds(currentUser).then(response => {
                if (!response.failed) {
                    const favoriteOtdIds = response.favoriteOtds;
                    const favoriteIds = new Set(response.favoriteOtds.map(otd => otd.otd_id_foreign));
                    setFavoritePrompts(favoriteIds);
                    // console.log(favoritePrompts);
                    const favoriteOtdDetailsPromises = favoriteOtdIds.map(otd =>
                        getOTD(otd.otd_id_foreign).then(otdResponse => {
                            if (!otdResponse.failed) {
                                const otdDetail = otdResponse.otd[0];
                                return {
                                    title: `${otdDetail.name} of the Day`,
                                    icon: otdDetail.emoji,
                                    answeredCount: otdDetail.num_total,
                                    id: otd.otd_id_foreign
                                };
                            } else {
                                return null;
                            }
                        })
                    );
                    Promise.all(favoriteOtdDetailsPromises).then(favoriteOtdDetails => {
                        const validDetails = favoriteOtdDetails.filter(detail => detail != null);
                        validDetails.sort((a, b) => b.answeredCount - a.answeredCount); // Sort from highest to lowest count
                        setPromptsForYou(validDetails);
                    });
                } else {
                    console.error('Failed to fetch favorite OTDs');
                }
            }).catch(error => {
                console.error('Error fetching favorite OTDs:', error);
            });
        }
        
    }, [currentUser]);

    const addFavorite = (id) => {
        addSpecificUserOtd(id, currentUser).then(result => {
            if (!result.failed) {
                setFavoritePrompts(prev => new Set(prev).add(id));
                // Assuming you have a way to fetch or construct the new favorite prompt detail
                getOTD(id).then(otdResponse => {
                    if (!otdResponse.failed) {
                        setPromptsForYou(prev => [
                            ...prev,
                            {
                                title: `${otdResponse.otd[0].name} of the Day`,
                                icon: otdResponse.otd[0].emoji,
                                answeredCount: otdResponse.otd[0].num_total,
                                id: id
                            }
                        ].sort((a, b) => b.answeredCount - a.answeredCount)); // Sorting after addition
                    }
                });
            }
        });
    };
    
    const removeFavorite = (id) => {
        removeSpecificUserOtd(id, currentUser).then(result => {
            if (!result.failed) {
                setFavoritePrompts(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(id);
                    return newSet;
                });
                setPromptsForYou(prev => prev.filter(prompt => prompt.id !== id));
            }
        });
    };

    const getPrompts = () => {
        return activeTab === 'ForYou' ? promptsForYou : promptsTrending;
    };

    const [promptOfTheDay, setPromptOfTheDay] = useState({
            title: 'Plant of the Day',
            icon: '🪴',
            answeredCount: 34, // Example answered count
            id: 18
    });

    // This function updates the search query state as the user types in the search bar
    const handleSearch = text => {
        setSearchQuery(text);
    };

    // const getFilteredPrompts = () => {
    //     const currentPrompts = getPrompts();
    //     const filtered = searchQuery.trim() === ''
    //         ? currentPrompts
    //         : currentPrompts.filter(prompt =>
    //             prompt.title.toLowerCase().includes(searchQuery.toLowerCase())
    //         );
    //     return filtered;
    // };

    const getFilteredPrompts = () => {
        // This function should return the filtered prompts based on the active tab
        let prompts;
        if (activeTab === 'ForYou') {
            prompts = promptsForYou;
        } else {
            prompts = promptsTrending;
        }
        // Apply the search filter
        return searchQuery.trim() === ''
            ? prompts
            : prompts.filter(prompt =>
                prompt.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
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
                    placeholderTextColor="lightgrey"
                />
            </View>
    
            {/* Prompt of the Day Container */}
            <View style={styles.promptOfTheDayContainer}>
                <Text style={styles.promptOfTheDayTodayHeader}>Today</Text>
                <PromptOTDItem
                    title={promptOfTheDay.title}
                    icon={promptOfTheDay.icon}
                    answeredCount={promptOfTheDay.answeredCount}
                    navigation={navigation}
                    isFavorite={favoritePrompts.has(promptOfTheDay.id)}
                    onAdd={() => addFavorite(promptOfTheDay.id)}
                    onRemove={() => removeFavorite(promptOfTheDay.id)}
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
                    activeTab === 'ForYou' ? (
                        <PromptItem
                            key={index}
                            title={prompt.title}
                            icon={prompt.icon}
                            answeredCount={prompt.answeredCount}
                            navigation={navigation}
                            onRemove={() => removeFavorite(prompt.id)}
                        />
                    ) : (
                        <PromptItemTrending
                            key={index}
                            title={prompt.title}
                            icon={prompt.icon}
                            answeredCount={prompt.answeredCount}
                            navigation={navigation}
                            isFavorite={favoritePrompts.has(prompt.id)}
                            onAdd={() => addFavorite(prompt.id)}
                            onRemove={() => removeFavorite(prompt.id)}
                        />
                    )
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black'
    },

    searchContainer: {
        padding: 10,
        backgroundColor: 'black',
    },

    searchInput: {
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        color: "white"
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
        backgroundColor: 'white',
        marginLeft: 0,
        marginTop: 3,
    },

    promptOfTheDayTodayHeader: {
        fontSize: 22,
        marginLeft: 3, 
        fontWeight: 'bold',
        color: "black"
    },

    promptOfTheDayHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        color: "white"
    },

    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'black',
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
        borderBottomColor: 'white',
    },
});

export default PostPage;