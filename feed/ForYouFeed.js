// The GlobalFeedPage component fetches and displays posts from all users in a global feed, offering sorting and filtering functionalities based on votes, recency, and categories.

import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'react-native';
import FeedItem from './FeedItem'; 
import sortIcon from '../assets/sort-icon.png'; 
import filterIcon from '../assets/filter-icon.png'; 
import { UserContext } from '../userContext';
import { getUser, getAllPosts, getAllOTDs, getAllUserFavoriteOtds } from '../database';
import { useNavigation } from '@react-navigation/native';

const ForYouFeedPage = ({navigation}) => {
    const { currentUser } = useContext(UserContext);
    const [globalFeed, setGlobalFeed] = useState([]);
    const [sortedAndFilteredFeed, setSortedAndFilteredFeed] = useState(globalFeed);
    const [sortType, setSortType] = useState('recency');
    const [filterCategory, setFilterCategory] = useState('');
    const [OTDs, setOTDs] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [favoriteOTDIds, setFavoriteOTDIds] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            getAllUserFavoriteOtds(currentUser).then(response => {
                if (!response.failed) {
                    setFavoriteOTDIds(new Set(response.favoriteOtds.map(otd => otd.otd_id_foreign)));
                }
            });
        }
    }, [currentUser]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data in the background
                const [postsResponse, otdsResponse] = await Promise.all([
                    getAllPosts(),
                    getAllOTDs()
                ]);
    
                if (!postsResponse.failed && !otdsResponse.failed) {
                    const filteredOTDs = otdsResponse.otds.filter(otd => favoriteOTDIds.has(otd.id));
                    setOTDs(filteredOTDs);
    
                    const posts = await Promise.all(postsResponse.posts.map(async post => {
                        // Process each post
                        if (post.username === currentUser) {
                            return null;
                        }
                        const user = await getUser(post.username);
                        if (user.failed) {
                            console.error({"Failed to fetch user:": post.username});
                            return null;
                        }

                        
                        
                        const otd = filteredOTDs.find(otd => otd.id === post.otd_id);
                        if (!otd) {
                            return null;
                        }

    
                        return {
                            ...post,
                            pfp: user.user[0].profile_pic,
                            name: `${user.user[0].first_name} ${user.user[0].last_name}`,
                            username_temp: user.user[0].username,
                            category: otd.name,
                            emoji: otd.emoji
                        };
                    }));
    
                    const filteredPosts = posts.filter(post => post !== null);
                    setGlobalFeed(filteredPosts);
                    sortAndFilterFeed(filteredPosts, sortType, filterCategory);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, [sortType, filterCategory, favoriteOTDIds]); 

    const sortAndFilterFeed = (posts, sortType, filterCategory) => {
        let updatedFeed = [...posts];
        if (sortType === 'votes') {
            updatedFeed.sort((a, b) => b.num_likes - a.num_likes);
        } else if (sortType === 'recency') {
            updatedFeed.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        if (filterCategory) {
            updatedFeed = updatedFeed.filter(item => item.category === filterCategory);
        }
        setSortedAndFilteredFeed(updatedFeed);
    };

    const showSortOptions = () => {
        // Set loading state before changing the sort type
        setIsLoading(true);
        Alert.alert('Sort by', 'Select the sorting method', [
            { text: 'Number of Upvotes', onPress: () => { setIsLoading(false); setSortType('votes') } },
            { text: 'Recency', onPress: () => { setIsLoading(false); setSortType('recency') } },
            { text: 'Cancel', style: 'cancel', onPress: () => setIsLoading(false) },
        ], { cancelable: true });
    };
    

    const showFilterOptions = () => {
        // Set loading state before showing the filter options
        setIsLoading(true);
        
        Alert.alert('Filter by Category', 'Select a category to filter by', [
            ...OTDs.map(otd => ({
                text: `${otd.emoji} ${otd.name} of the day`,
                onPress: () => {
                    // Set filter category and indicate loading has finished
                    setFilterCategory(otd.name);
                    setIsLoading(false);
                },
            })),                
            { text: 'Clear Filter', onPress: () => {
                // Clear filter category and indicate loading has finished
                setFilterCategory('');
                setIsLoading(false);
            } },
            { text: 'Cancel', style: 'cancel', onPress: () => setIsLoading(false) },
        ], { cancelable: true });
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 10000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={showSortOptions} style={styles.iconButton}>
                    <Image source={sortIcon} style={styles.icon} />
                    <Text style={styles.iconText}>Sort</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={showFilterOptions} style={styles.iconButton}>
                    <Image source={filterIcon} style={styles.icon} />
                    <Text style={styles.iconText}>Filter</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.promptsContainer}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#05452b" />
                ) : sortedAndFilteredFeed.length > 0 ? (
                    sortedAndFilteredFeed.map((item, index) => (
                        <FeedItem
                            key={index}
                            postId={item.id}
                            pfp={item.pfp}
                            name={item.name}
                            username={item.username_temp}
                            category={item.category}
                            text={item.text}
                            image={item.image}
                            emoji={item.emoji}
                            num_likes={item.num_likes}
                            num_comments={item.num_comments}
                            created_at={item.created_at}
                            currentUsername={currentUser}
                            onDelete={() => setRefreshTrigger(prev => !prev)}
                            navigation={navigation}
                        />
                    ))
                ) : (
                    null // Do not render anything if isLoading is true
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black', // Dark theme background color
        marginVertical: 80
    },

    searchContainer: {
        marginTop: 20,
        paddingHorizontal: 10,
    },

    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
    },

    promptsContainer: {
        marginTop: 5,
    },

    promptsHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
    },

    sortingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
    },

    sortButton: {
        padding: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
    },

    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        paddingBottom: 5
    },

    button: {
        padding: 10,
        backgroundColor: '#e0e0e0', // Consider changing for dark theme if this is used
        borderRadius: 5,
    },

    iconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#05452b',
        padding: 9,
        borderRadius: 5,
        width: 210
    },

    icon: {
        width: 25, 
        height: 25, 
        marginRight: 5,
    },

    noPostsText: {
        color: '#FFFFFF', // White text color for better contrast on dark background
        textAlign: 'center',
    },
    iconText: {
        color: 'white', // Text color for icons set to white for better contrast
    },
});

export default ForYouFeedPage;