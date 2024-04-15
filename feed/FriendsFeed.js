// The FriendsFeedPage component displays posts from friends of the current user, with functionality to sort and filter posts based on preferences like votes and recency. It leverages the UserContext to access current user information and utilizes the database functions to fetch relevant posts and user details.

import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'react-native';
import FeedItem from './FeedItem'; 
import sortIcon from '../assets/sort-icon.png'; 
import filterIcon from '../assets/filter-icon.png'; 
import { UserContext } from '../userContext';
import { getUser, getAllPosts, getAllOTDs, getFriendships } from '../database';

const FriendsFeedPage = () => {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    //console.log({"current user from posts:": currentUser});
    const [friendsFeed, setFriendsFeed] = useState([]);
    const [sortedAndFilteredFeed, setSortedAndFilteredFeed] = useState(friendsFeed); // Initial feed data
    const [sortType, setSortType] = useState('votes'); // Default sort by votes
    const [filterCategory, setFilterCategory] = useState(''); // Track the current filter
    const [OTDs, setOTDs] = useState([]);

    // Combined function to sort and filter feed
    const sortAndFilterFeed = () => {
        let updatedFeed = [...friendsFeed];

        // Sorting
        if (sortType === 'votes') {
            updatedFeed.sort((a, b) => b.num_likes - a.num_likes);
        } else if (sortType === 'recency') {
            updatedFeed.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        // Filtering
        if (filterCategory) {
            updatedFeed = updatedFeed.filter(item => item.category === filterCategory);
        }
        setSortedAndFilteredFeed(updatedFeed);
        //console.log({"sorted and filtered feed: ": sortedAndFilteredFeed});
    };
    
    // Re-sort and re-filter feed whenever sortType or filterCategory changes
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // fetch all posts from database
                const posts_res = await getAllPosts();
                if (posts_res.failed) {
                    console.error("Failed to fetch posts");
                    return;
                }
                //console.log({"fetched posts:": posts_res.posts});
                let posts = posts_res.posts;

                // get friendships for current logged in user
                const friendships_res = await getFriendships(currentUser);
                if (friendships_res.failed) {
                    console.error({"Failed to get friendships for user:": currentUser});
                    return;
                }
                //console.log({"user": currentUser, "obtained friends": friendships_res.friends});

                // filter feed based on friendships
                posts = posts.filter(post => friendships_res.friends.includes(post.username));
                
                // fetch user and otd data from database for each post
                for (let i = 0; i < posts.length; i++) {
                    // fetch user data
                    const user_res = await getUser(posts[i].username);
                    if (user_res.failed) {
                        console.error({"Failed to fetch user:": posts[i].username});
                        return;
                    }
                    //console.log({"obtained user of post: ": user_res.user});

                    // set user data
                    let user = user_res.user[0];
                    posts[i].pfp = user.profile_pic;
                    posts[i].name = user.first_name + ' ' + user.last_name;

                    // fetch otd data
                    const otd_res = await getAllOTDs();
                    if (otd_res.failed) {
                        console.error("Failed to fetch otds");
                        return;
                    }
                    //console.log({"fetched otds:": otd_res.otds});
                    // set OTDs variable for filtering use later
                    setOTDs(otd_res.otds);
                    
                    // set otd data
                    let otd = otd_res.otds.filter(prompt => prompt.id === posts[i].otd_id);
                    //console.log({"obtained otd of post: ": otd});
                    posts[i].category = otd[0].name;
                    posts[i].emoji = otd[0].emoji;
                }
                setFriendsFeed(posts);
                //console.log({"posts data": friendsFeed});

            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        
        fetchPosts();
        sortAndFilterFeed();
    }, [sortType, filterCategory, friendsFeed.length]);

    // display sorting options
    const showSortOptions = () => {
        Alert.alert(
            'Sort by',
            'Select the sorting method',
            [
                { text: 'Number of Upvotes', onPress: () => setSortType('votes') },
                { text: 'Recency', onPress: () => setSortType('recency') },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true },
        );
    };

    // display filtering options
    const showFilterOptions = () => {
        Alert.alert(
            'Filter by Category',
            'Select a category to filter by',
            [
                ...OTDs.map(prompt => ({
                    text: `${prompt.emoji} ${prompt.name} of the day`,
                    onPress: () => setFilterCategory(prompt.name),
                })),                
                { text: 'Clear Filter', onPress: () => setFilterCategory('') },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true },
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.buttonsContainer}>
                {/* Sort Options Button replaced with an image icon */}
                <TouchableOpacity onPress={showSortOptions} style={styles.iconButton}>
                    <Image source={sortIcon} style={styles.icon} />
                    <Text>Sort</Text>
                </TouchableOpacity>

                {/* Filter Options Button replaced with an image icon */}
                <TouchableOpacity onPress={showFilterOptions} style={styles.iconButton}>
                    <Image source={filterIcon} style={styles.icon} />
                    <Text>Filter</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.promptsContainer}>
    {sortedAndFilteredFeed.length > 0 ?
    sortedAndFilteredFeed.map((item, index) => (
        <FeedItem
        key={index}
        postId={item.id}
        pfp = {item.pfp}
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
        />
    )):
    <Text style={styles.noPostsText}>Loading or Find Friends!</Text>}
</View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
    },

    button: {
        padding: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
    },

    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },

    iconButton: {
        flexDirection: 'row',
        alignItems: 'center', // Centers the content vertically
        justifyContent: 'center', // Centers the content horizontally
        backgroundColor: '#e0e0e0',
        padding: 10,
        borderRadius: 5,
        width: 210
    },

    icon: {
        width: 25, 
        height: 25, 
        marginRight: 5, // Adds spacing between icon and text
    },
    noPostsText: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center', // For centering text horizontally
    }

});

export default FriendsFeedPage;
