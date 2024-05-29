// Component for displaying individual feed items, handling like and comment interactions, and integrating modal for comments.

import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, Modal, TextInput, Button, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { checkIfUserLikedPost, toggleLike, postCommentToBackend, deletePost, fetchComments, fetchUserProfilePic, countCommentsForPost } from './database.js'; 
import { UserContext } from './userContext';
import { formatDistanceToNow } from 'date-fns';

function convertTimestamp(timestamp) {
    // Current time in milliseconds
    var now = new Date().getTime();

    // Calculate the difference in milliseconds
    var difference = now - new Date(timestamp).getTime();

    // Convert milliseconds to minutes, hours, and days
    var minutes = Math.floor(difference / (1000 * 60));
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);

    // If more than a day ago, display days
    if (days > 0) {
        return days + " day" + (days === 1 ? "" : "s");
    }
    // If more than an hour ago, display hours
    else if (hours > 0) {
        return hours + " hr" + (hours === 1 ? "" : "s");
    }
    // Otherwise, display minutes
    else {
        return minutes + " min" + (minutes === 1 ? "" : "s");
    }
}

const FeedItemProfiles = ({ pfp, username, name, category, text, image, emoji, num_likes, num_comments, created_at, postId, currentUsername, onDelete}) => {;
    // const cloudinaryUrl = 'https://res.cloudinary.com/your_cloud_name/image/fetch';
    // const quality = 5; // Quality ranges from 0 (worst) to 100 (best)

    // if (image != null) {
    //     const image = `${cloudinaryUrl}/q_${quality}/${encodeURIComponent(image)}`;


    // }
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(num_likes);

    // Placeholder functions for each action
    const handleComment = () => console.log('Comment');
    const handleShare = () => console.log('Shared');
    // Add useEffect to check the initial like status
    useEffect(() => {
        const fetchLikeStatus = async () => {
            const likedStatus = await checkIfUserLikedPost(currentUsername, postId);
            setIsLiked(likedStatus);
        };

        fetchLikeStatus();
    }, [postId, currentUsername]);

    const handleUpvote = async () => {
        const newIsLikedState = !isLiked; // Toggle the liked state
        
        // Attempt to update the backend first
        const success = await toggleLike(postId, currentUsername, newIsLikedState);
        
        if (success) {
            // If the backend update succeeds, update UI state
            setIsLiked(newIsLikedState);
            setLikesCount(newIsLikedState ? likesCount + 1 : likesCount - 1);
        } else {
            // If the backend update fails, log an error
            console.error('Failed to update the like status in the backend');
        }
    };

    // Add a new state within FeedItem to control modal visibility and comment text
    const [isCommentModalVisible, setCommentModalVisible] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [commentsCount, setCommentsCount] = useState(0);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);

    // Function to handle the posting of a comment
    const postComment = async () => {
        const profilePicUrl = await fetchUserProfilePic(currentUser);
        const success = await postCommentToBackend(postId, currentUser, commentText, profilePicUrl);
        if (success) {
            setCommentText(''); // Clear the input field
            // setCommentModalVisible(false); // Close the modal
            // Re-fetch comments count and comments list
            await fetchCommentsAndUpdateState(postId);
        }
    };

    const fetchCommentsAndUpdateState = async (postId) => {
        await fetchComments(postId, setLoadingComments, setComments);
        await countCommentsForPost(postId, setCommentsCount);
    };

    useEffect(() => {
        if (postId) {
            countCommentsForPost(postId, setCommentsCount);
        }
    }, [postId]);

    // Function to handle deletion of a post
    const handleDelete = async (postId) => {
        const success = await deletePost(postId);
        if (success) {
            alert('Post deleted successfully');
            onDelete(); // Call the onDelete function passed via props
        } else {
            console.error('Failed to delete the post');
        }
    };

    const timestamp = convertTimestamp(created_at);


    return (
        <TouchableOpacity style={styles.feedItem}>
            <View style={[styles.userInfo, { justifyContent: 'space-between' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Image source={{ uri: pfp }} style={styles.profilePicture} />
                    <View>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.followingUsername}>@{username}</Text>
                    </View>
                </TouchableOpacity>

                <Text style={styles.timestamp}>{convertTimestamp(created_at)}</Text>
                </View>
            </View>
            <Text style={styles.category}>{emoji} {category} of the day:</Text>
            <Text style={styles.text}>{text}</Text>
            {image ? <Image source={{ uri: image }} style={styles.feedImage} /> : null}
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={handleUpvote}>
                    <View style={styles.iconView}>
                        <Icon name={isLiked ? "heart" : "heart-outline"} size={20} color={isLiked ? "red" : "#FFFFFF"} />
                    </View>
                    <View style={styles.textView}>
                        <Text style={styles.actionText}>{likesCount}  </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}                    onPress={async () => {
                    await fetchComments(postId, setLoadingComments, setComments);
                    setCommentModalVisible(true);}}
                >
                    <View style={styles.iconView}>
                        <Icon color="#FFFFFF" name="chatbubble-outline" size={20} />
                    </View>
                    <View style={styles.textView}>
                        <Text style={styles.actionText}>{commentsCount}</Text>
                    </View>
                </TouchableOpacity>
                {/* <View style={styles.actionButton}>
                    <View style={styles.iconView}>
                        <Icon name="share-social-outline" size={20} color="#FFFFFF"/>
                    </View>
                </View> */}
                {currentUsername === username && (
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(postId)}>
                        <Icon name="trash-outline" size={20} color="#FFFFFF"/>
                    </TouchableOpacity>
                )}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isCommentModalVisible}
                    onRequestClose={() => {
                        setCommentModalVisible(!isCommentModalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                        <ScrollView style={styles.commentsContainer}>
                            {loadingComments ? (
                                <Text>Loading comments...</Text>
                            ) : (
                                comments.map((comment, index) => (
                                    <View key={index} style={styles.commentItem}>
                                        <Image 
                                            source={{uri: comment.image}} 
                                            style={styles.profilePic} 
                                        />
                                        <Text style={styles.commentUsername}>{comment.username_foreign}</Text>
                                        <Text style={styles.commentContent}>{comment.comment}</Text>
                                        <Text style={styles.commentTimestamp}>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</Text>
                                    </View>
                                ))
                            )}
                            </ScrollView>
                            <TextInput
                                style={styles.commentInput}
                                onChangeText={setCommentText}
                                value={commentText}
                                placeholder="Write a comment..."
                                placeholderTextColor="#999" 
                                multiline={true} // Allows multiple lines of text
                            />
                            <View style={{width: '100%', paddingHorizontal: 10}}>
                            <Button onPress={postComment} 
                            title="Post Comment" />
                            {/* Cancel Button */}
                            <Button
                                onPress={() => setCommentModalVisible(false)}
                                title="Cancel"
                                color="#ff5c5c" 
                            />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    feedItem: {
        backgroundColor: '#121212',
        borderRadius: 10,
        padding: 15,
        marginBottom: 6,
        marginTop: 0,
        elevation: 3,
        shadowColor: '#FFFFFF',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
    },

    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },

    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "#FFFFFF"
    },

    category: {
        fontSize: 14,
        color: 'grey',
        marginBottom: 5,
    },

    text: {
        fontSize: 16,
        color: "#FFFFFF"
    },

    feedImage: {
        width: '100%',
        height: 330,
        borderRadius: 10,
        marginTop: 10,
    },

    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around', // This will distribute space evenly around the action buttons
        marginTop: 10,
    },

    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center the icon and text inside the button
        padding: 5,
    },

    iconView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30, // Ensures a consistent size for alignment
    },

    deleteButton: {
        padding: 5,
        marginLeft: 10,
    }, 

    textView: {
        justifyContent: 'center',
        alignItems: 'center', // Centers text horizontally in the available space
    },

    timestamp: {
        fontSize: 14,
        color: 'grey', 
        alignSelf: 'flex-start',
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },

    profilePic: {
        width: 30, // Smaller size
        height: 30, // Equal width and height make the image square
        borderRadius: 15, // Half of width/height to make it circular
        marginRight: 10,
    },

    commentUsername: {
        fontWeight: 'bold',
        marginRight: 5,
        color: "white",
    },

    commentContent: {
        flex: 1, // Allows the comment to fill available space, pushing timestamp to the edge
        color: "white",
    },

    commentTimestamp: {
        fontSize: 9,
        color: '#888',
        marginLeft: 5,
    },

    modalView: {
        borderColor: "grey",
        borderWidth: 1,
        margin: 20,
        backgroundColor: '#121212',
        borderRadius: 20,
        padding: 25,
        alignItems: 'stretch',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 40,
        width: '90%', // Increase the width of the modal
        height: '59%', // Adjust the max height of the modal
        marginTop: -260
    },

    commentsContainer: {
        flex: 1, // Give ScrollView flex to take up available space
        width: '100%', // Ensure it occupies the full width of the modal
        marginBottom: 20, // Provide space between the comments and the input section
        minHeight: 100, // Ensure there's a minimum height
    },

    commentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 5, 
    },

    commentInput: {
        height: 40, // Reduce the height to minimize the space it takes
        width: '100%', // Ensure the input box takes the full width of the modal
        paddingHorizontal: 10, // Padding inside the input
        borderColor: '#ccc', // Add border color
        borderWidth: 1,
        borderRadius: 5, // Round corners
        marginBottom: 10, // Space before the buttons
        color: "white",
    },
    actionText: {
        color: "#FFFFFF"
    },

    followingUsername: {
        color: "gray"

    },
});

export default FeedItemProfiles;
