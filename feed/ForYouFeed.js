// The GlobalFeedPage component fetches and displays posts from all users in a global feed, offering sorting and filtering functionalities based on votes, recency, and categories.

import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'react-native';
import FeedItem from './FeedItem'; 
import sortIcon from '../assets/sort-icon.png'; 
import filterIcon from '../assets/filter-icon.png'; 
import { UserContext } from '../userContext';
import { getUser, getAllPosts, getAllOTDs, getAllUserFavoriteOtds } from '../database';

const ForYouFeedPage = () => {
    const { currentUser } = useContext(UserContext);
    const [globalFeed, setGlobalFeed] = useState([]);
    const [sortedAndFilteredFeed, setSortedAndFilteredFeed] = useState(globalFeed); // Initial feed data
    const [sortType, setSortType] = useState('recency'); // Default sort by recency
    const [filterCategory, setFilterCategory] = useState(''); // Track the current filter
    const [OTDs, setOTDs] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [favoriteOTDIds, setFavoriteOTDIds] = useState(new Set());


    useEffect(() => {
        if (currentUser) {
            getAllUserFavoriteOtds(currentUser).then(response => {
                if (!response.failed) {
                    setFavoriteOTDIds(new Set(response.favoriteOtds.map(otd => otd.otd_id_foreign)));
                }
            });
        }
    }, [currentUser]);
    
    // Re-sort and re-filter feed whenever sortType or filterCategory changes
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const resPosts = await getAllPosts();
                const resOTDs = await getAllOTDs();
                if (!resPosts.failed && !resOTDs.failed) {
                    let filteredOTDs = resOTDs.otds.filter(otd => favoriteOTDIds.has(otd.id));
                    setOTDs(filteredOTDs);  // Ensure OTD list is filtered by user's favorites

    
                    let posts = await Promise.all(resPosts.posts.map(async post => {

    
                        if (post.username === currentUser) {
                            return null;  // Skip this post if it's by the current user
                        }
        
                        let user = await getUser(post.username);
                        if (user.failed) {
                            console.error({"Failed to fetch user:": post.username});
                            return null;  // Skip this post if user data cannot be fetched
                        }
                        
                        let otd = filteredOTDs.find(otd => otd.id === post.otd_id);
                        if (!otd) {
                            return null;  // Skip this post if OTD data is not in the filtered list
                        }

                        // console.log(user.user)
                        // console.log(user.user[0].username)

                        return {
                            ...post,
                            pfp: user.user[0].profile_pic,
                            name: `${user.user[0].first_name} ${user.user[0].last_name}`,
                            username_temp: user.user[0].username,
                            category: otd.name,
                            emoji: otd.emoji
                        };
                    }));
            
                    posts = posts.filter(post => post !== null);  // Remove any nullified posts
                    setGlobalFeed(posts);
                    sortAndFilterFeed(posts, sortType, filterCategory);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchPosts();
        


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
        Alert.alert('Sort by', 'Select the sorting method', [
            { text: 'Number of Upvotes', onPress: () => setSortType('votes') },
            { text: 'Recency', onPress: () => setSortType('recency') },
            { text: 'Cancel', style: 'cancel' },
        ], { cancelable: true });
    };


    const showFilterOptions = () => {
        Alert.alert('Filter by Category', 'Select a category to filter by', [
            ...OTDs.map(otd => ({
                text: `${otd.emoji} ${otd.name} of the day`,
                onPress: () => setFilterCategory(otd.name),
            })),                
            { text: 'Clear Filter', onPress: () => setFilterCategory('') },
            { text: 'Cancel', style: 'cancel' },
        ], { cancelable: true });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.buttonsContainer}>
                {/* Sort Options Button replaced with an image icon */}
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
                {sortedAndFilteredFeed.length > 0 ?
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
                    />
                )):
                <Text style={styles.noPostsText}>Loading</Text>}
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
