// A screen allowing users to create and post content in response to daily prompts, with options for text and image uploads.

import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { UserContext } from './userContext';
import { addPost } from './database.js';

const CLOUDINARY_CLOUD_NAME = 'dybcyj2qc';
const CLOUDINARY_UPLOAD_PRESET = 'iaa4ymix';

const PostScreen = ({ route, navigation }) => {
    const { promptTitle, promptIcon } = route.params;
    const [postText, setPostText] = useState('');
    const [image, setImage] = useState(null); // Add state to hold the selected image
    const { currentUser } = useContext(UserContext); // Use the currentUser from the context

    const uploadImage = async (uri) => {
        const formData = new FormData();
        formData.append('file', {
            uri: uri,
            type: 'image/jpeg', 
            name: 'upload.jpg',
        });
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
            const data = await response.json();
            if (data.secure_url) {
                return data.secure_url;
            } else {
                Alert.alert('Error uploading image', data.error ? data.error.message : 'An error occurred');
                return null;
            }
        } catch (err) {
            console.error('Upload error:', err);
            Alert.alert('Upload error', 'An error occurred while uploading the image.');
            return null;
        }
    };

    const getOtdIdBasedOnPrompt = (promptTitle) => {
        // Define a mapping of prompt titles to otd IDs
        const promptToOtdIdMapping = {
            'Sunset of the Day': 1,
            'Song of the Day': 2, 
            'Outfit of the Day': 3,
            'Selfie of the Day': 4,
            'Painting of the Day': 5,
            'Quote of the Day': 6,
            'Book of the Day': 7,
            'Recipe of the Day': 8,
            'Joke of the Day': 9,
            'Glizzy of the Day': 10,
            'Workout of the Day': 11,
            'Thought of the Day': 12,
            'Struggle of the Day': 13, 
            'Pet of the Day': 14,
            'Dog of the Day': 15,
            'Good Dead of the Day': 16,
            'Meal of the Day': 17,
            'Plant of the Day': 18,
            'Mood of the Day': 19,
            'Laugh of the Day': 20,
            'Trivia of the Day': 21,
            'Self-Care Act of the Day': 22,
            'New Tech of the Day': 23,
            'Sunrise of the Day': 24, 
            'Travel View of the Day': 25,
            'Life Hack of the Day': 26,
            'Thirst Trap of the Day': 27,
            'Lesson of the Day': 28,
            'Couple of the Day': 29,
            'Sports Highlight of the Day': 30,
            'News of the Day': 31,
            'Baby of the Day': 32,
            'Cat of the Day': 33,
            'Coffee of the Day': 34, 
            'Snack of the Day': 35,
            'Architectural Marvel of the Day': 36,
            'Movie of the Day': 37,
            'Achievement of the Day': 38,
            'Pride of the Day': 39,
            'Throwback of the Day': 40,
        };
    
        // Return the corresponding otd ID, or a default value if not found
        return promptToOtdIdMapping[promptTitle] || 0;
    };

    const handlePost = async () => {
        // Check if both image and postText are empty/null
        if (!image && !postText.trim()) {
            Alert.alert("Missing Content", "Please add an image or a caption to post.");
            return; // Exit the function early
        }
    
        const otd = getOtdIdBasedOnPrompt(promptTitle);
    
        // If the function hasn't returned, proceed with creating and posting the object
        const post = {
            text: postText,
            image: image, // assuming image is a URL or base64 string
            username: currentUser, // assuming currentUser is a string
            otd: otd,
        };
    
        // Add the post to the database
        const success = await addPost(post);
    
        if (success) {
            // If the post was added successfully, go back to the previous screen
            navigation.goBack();
        } else {
            // If there was an error, alert the user
            Alert.alert('Error', 'Unable to add post at this time.');
        }
    };
        
    const showMediaOptions = () => {
        let options = [
            { text: 'Take Photo', onPress: takePhoto },
            { text: 'Upload from Library', onPress: selectFromLibrary },
        ];
    
        // Only add the "Remove Photo" option if there is an image set
        if (image !== null) {
            options.push({ text: 'Remove Photo', onPress: resetPhoto });
        }
    
        // Always have a cancel option
        options.push({ text: 'Cancel', style: 'cancel' });
    
        Alert.alert(
            'Upload Media',
            'Choose an option',
            options,
            { cancelable: true },
        );
    };

    // Function to take a photo
    const takePhoto = async () => {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

        if (cameraPermission.status !== 'granted') {
            alert('Camera permission is required to take photos.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        handleImagePicked(result);
    };

    // Function to select an image from the library
    const selectFromLibrary = async () => {
        const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (libraryPermission.status !== 'granted') {
            alert('Permission to access gallery is required to choose photos.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        handleImagePicked(result);
    };

    const handleImagePicked = async (pickerResult) => {
        try {
            if (!pickerResult.cancelled) {
                const uploadUrl = await uploadImage(pickerResult.assets[0].uri);
                setImage(uploadUrl); // Use the uploaded image's URL for the image state
            }
        } catch (e) {
            console.error(e);
            alert('Upload failed, sorry :(');
        }
    };

    // Function to reset the photo
    const resetPhoto = () => {
        setImage(null);
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{promptIcon} {promptTitle}</Text>
                <TouchableOpacity onPress={handlePost} style={styles.headerButton}>
                    <Text style={styles.postButton}>Post</Text>
                </TouchableOpacity>
            </View>

            {
            image && (
                <View style={styles.imagePreview}>
                    <ImageBackground source={{ uri: image }} style={styles.image}>
                        {}
                    </ImageBackground>
                </View>
                )
            }

            <TextInput
                style={styles.textInput}
                placeholder="Your post (max 350 characters)"
                multiline
                maxLength={350}
                onChangeText={setPostText}
                value={postText}
                placeholderTextColor={"grey"}
            />
            {/* Moved the button outside and below the TextInput */}
            <TouchableOpacity style={styles.multimediaButton} onPress={showMediaOptions}>
                <Icon name="add-a-photo" size={40} color="white" />
            </TouchableOpacity>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#121212',
        paddingBottom: 80,
    },

    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20, // Increased padding for more space
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    },

    headerButton: {
        padding: 10, // Padding to increase touchable area
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1, // This will make title center-aligned when text buttons have equal width
        color: "white",
    },

    textInput: {
        flex: 1,
        paddingTop: 15, // Reduced padding to allow more space for text
        paddingHorizontal: 15,
        fontSize: 16,
        textAlignVertical: 'top',
        color: "white",
    },

    cancelButton: {
        color: '#007AFF',
        fontSize: 18,
    },

    postButton: {
        color: '#007AFF',
        fontWeight: 'bold',
        fontSize: 18,
    },

    multimediaButton: {
        alignItems: 'center', // This will center the button horizontally
        marginBottom: 20, // Adds some margin at the bottom
    },

    imagePreview: {
        alignItems: 'center',
        justifyContent: 'center', // Center the image horizontally and vertically
        width: '100%', // Set width to take the full width of the screen
        height: 250, // Set a fixed height for the preview
    },

    image: {
        width: '100%', // The image should take the full width of its container
        height: '100%', // The image should take the full height of its container
        resizeMode: 'contain', // The image should be scaled to fit within the frame
    },
});

export default PostScreen;
