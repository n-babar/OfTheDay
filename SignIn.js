// A sign-in screen providing user authentication functionality, including login and registration forms, with terms and services acceptance for new registrations.

import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import { createNavigationContainerRef, useNavigation } from '@react-navigation/native';
import { addUserToDatabase, checkUsernameExists, verifyLoginAttempt, updateUserProfile } from './database';
import { UserContext } from './userContext';
import TermsModal from './Terms';
import { navigationRef, navigate } from './NavigationRef';
import { useTab } from './TabContext';
import * as ImagePicker from 'expo-image-picker';

const CLOUDINARY_CLOUD_NAME = 'dybcyj2qc';
const CLOUDINARY_UPLOAD_PRESET = 'iaa4ymix';

const SignIn = ({ setActiveTab, setErrorMessage }) => {
    const [loginVisible, setLoginVisible] = useState(false);
    const [registerVisible, setRegisterVisible] = useState(false);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [profilePicVisible, setProfilePicVisible] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [termsVisible, setTermsVisible] = useState(false);
    const [accept, setAccept] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const { changeTab } = useTab();

    // for password checking
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;

    const handleLoginPress = () => {
        setLoginVisible(true);
    };

    const handleRegisterPress = () => {
        setRegisterVisible(true);
    };

    const handleLoginClose = async () => {
        const isValidLogin = await verifyLoginAttempt(username, password);
        setLoginVisible(false);

        if (!isValidLogin) {
            setErrorMessage("This username and password combination does not exist");
        } else {
            setCurrentUser(username);
            navigate('Feed');
            setActiveTab('Feed');
            changeTab('Feed');
            navigationRef.current.reset({
                index: 0,
                routes: [{ name: 'Feed' }],
            }); 
        }
    };

    const handleCancelLogin = () => {
        setLoginVisible(false);
    };

    const handleCancelRegister = () => {
        setRegisterVisible(false);
    };

    const handleRegisterClose = async () => {
        setRegisterVisible(false);

        let errorMessage = "";
        if (username.length < 6) {
            errorMessage += "Username must be at least 6 characters long\n";
        }

        if (password.length < 6) {
            errorMessage += "Password must be at least 6 characters long\n";
        }

        if (!lowerCaseRegex.test(password)) {
            errorMessage += "Password must contain a lower case character\n";
        }

        if (!upperCaseRegex.test(password)) {
            errorMessage += "Password must contain an upper case character\n";
        }

        if (!numberRegex.test(password)) {
            errorMessage += "Password must contain a number\n";
        }

        if (!specialCharRegex.test(password)) {
            errorMessage += "Password must contain a special case character\n";
        }

        if (errorMessage !== "") {
            setErrorMessage(errorMessage);
            return;
        }

        const isUsernameTaken = await checkUsernameExists(username);

        if (!isUsernameTaken) {
            setDetailsVisible(true); // Show details input modal
        } else {
            setErrorMessage("This username is already taken, try a new one");
        }
    };

    const handleDetailsClose = async () => {
        if (!firstName || !lastName || !location || !bio) {
            Alert.alert('Error', 'All fields are required. Please fill in all details.');
            return;
        }
        setDetailsVisible(false);
        setProfilePicVisible(true);
    };

    const handleCancelDetails = () => {
        setDetailsVisible(false);
    };

    const handleProfilePicClose = async () => {
        setProfilePicVisible(false);
        setTermsVisible(true);
    };

    const handleTermsClose = () => {
        setTermsVisible(false);
        if (isChecked) {
            setAccept(true); // This will trigger the useEffect below
        } else {
            setErrorMessage("Terms and Services must be accepted to create an account");
        }
    };

    useEffect(() => {
        const performRegistration = async () => {
            if (accept) {
                const success = await addUserToDatabase(username, password);
                if (success) {
                    const updates = {};
                    if (firstName) updates.first_name = firstName;
                    if (lastName) updates.last_name = lastName;
                    if (bio) updates.bio = bio;
                    if (location) updates.location = location;
                    if (password) updates.password = password; 
                    if (profilePic) updates.profile_pic = profilePic;
                    await updateUserProfile(username, updates);
                    setCurrentUser(username);
                    navigate('Post');
                    setActiveTab('Post');
                    changeTab('Post');
                    navigationRef.current.reset({
                        index: 0,
                        routes: [{ name: 'Post' }],
                    }); 
                    setAccept(false); // Reset the accept state to prevent future unintended registrations
                } else {
                    setErrorMessage("Failed to create an account. Please try again.");
                }
            }
        };

        if (accept) {
            performRegistration();
        }
    }, [accept, username, password, setCurrentUser, firstName, lastName, location, bio, profilePic]);

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

        if (!result.canceled) {
            handleImagePicked(result.assets[0].uri);
            setProfilePicVisible(false);
            setTermsVisible(true);
        } 





    };

    const chooseFromLibrary = async () => {
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

        if (!result.canceled) {
            handleImagePicked(result.assets[0].uri);
            setProfilePicVisible(false);
            setTermsVisible(true);
        } 
    };

    const handleImagePicked = async (uri) => {
        const uploadedImageUrl = await uploadImage(uri);
        if (uploadedImageUrl) {
            setProfilePic(uploadedImageUrl);
        }
    };

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

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>otd</Text>
            </View>
            <Text style={styles.title}>Welcome</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleRegisterPress}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>

            {/* Login Modal */}
            <Modal
                visible={loginVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={handleLoginClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Login</Text>
                        <TextInput placeholder="Username" style={styles.input} onChangeText={text => setUsername(text)} />
                        <TextInput placeholder="Password" secureTextEntry={true} style={styles.input} onChangeText={text => setPassword(text)} />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.buttonLogin} onPress={handleLoginClose}>
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.buttonCancel]} onPress={handleCancelLogin}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Register Modal */}
            <Modal
                visible={registerVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={handleRegisterClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Register</Text>
                        <TextInput placeholder="Username" style={styles.input} onChangeText={text => setUsername(text)} />
                        <TextInput placeholder="Password" secureTextEntry={true} style={styles.input} onChangeText={text => setPassword(text)} />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.buttonRegister} onPress={handleRegisterClose}>
                                <Text style={styles.buttonText}>Register</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonCancelRegister} onPress={handleCancelRegister}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Details Modal */}
            <Modal
                visible={detailsVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={handleDetailsClose}
            >
                <View style={styles.modalContainerDetails}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>User Details</Text>
                        <TextInput placeholder="First Name" style={styles.input} onChangeText={text => setFirstName(text)} />
                        <TextInput placeholder="Last Name" style={styles.input} onChangeText={text => setLastName(text)} />
                        <TextInput placeholder="Location" style={styles.input} onChangeText={text => setLocation(text)} />
                        <TextInput placeholder="Bio" style={styles.input} onChangeText={text => setBio(text)} multiline={true} />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.buttonNext} onPress={handleDetailsClose}>
                                <Text style={styles.buttonText}>Next</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonCancelRegister} onPress={handleCancelDetails}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Profile Pic Modal */}
            <Modal
                visible={profilePicVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={handleProfilePicClose}
                syle={styles.photoModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Upload Profile Picture</Text>
                        <Button title="Take Photo" onPress={takePhoto} />
                        <View style={styles.separator} />
                        <Button title="Choose from Library" onPress={chooseFromLibrary} />
                        <View style={styles.separator} />
                        <Button title="Skip" onPress={handleProfilePicClose} />
                    </View>
                </View>
            </Modal>

            <TermsModal
                visible={termsVisible}
                onClose={handleTermsClose}
                setIsChecked={setIsChecked}
                isChecked={isChecked}
            />
        </View>
    );
};

const styles = StyleSheet.create({
  

    headerText: {
        fontSize: 100,
        fontWeight: 'bold',
        color: 'white',
        marginTop: -210,
        backgroundColor: "#061b26",
        borderWidth: 0,
        borderColor: "grey",
        borderRadius: 10,
        padding: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#061b26',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: "white"
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginHorizontal: 10,
        borderRadius: 5,
    },
    buttonLogin: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        paddingHorizontal: 40,
        marginRight: 5,
        borderRadius: 5,
    },
    buttonRegister: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        paddingHorizontal: 28,
        marginRight: 5,
        borderRadius: 5,
    },
    buttonNext: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        paddingHorizontal: 44.5,
        marginRight: 5,
        borderRadius: 5,
    },
    buttonCancel: {
        backgroundColor: '#ff6f61',
        paddingVertical: 15,
        paddingHorizontal: 35.5,
        marginHorizontal: 10,
        borderRadius: 5,
    },
    buttonCancelRegister: {
        backgroundColor: '#ff6f61',
        paddingVertical: 15,
        paddingHorizontal: 35,
        marginHorizontal: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerButton: {
        backgroundColor: '#2ecc71',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainerDetails: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingBottom: 255,
    },

    modalContent: {
        backgroundColor: '#121212',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        borderWidth: 1,
        borderColor: "grey",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: "white",
    },
    input: {
        backgroundColor: '#ecf0f1',
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
    },
    modalButton: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 5,
    },
});

export default SignIn;
