// A sign-in screen providing user authentication functionality, including login and registration forms, with terms and services acceptance for new registrations.

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from 'react-native';
import { createNavigationContainerRef, useNavigation } from '@react-navigation/native';
import { addUserToDatabase, checkUsernameExists, verifyLoginAttempt } from './database';
import { UserContext } from './userContext';
import TermsModal from './Terms';
import { navigate } from './NavigationRef';
import { useTab } from './TabContext';

const SignIn = ({ setActiveTab, setErrorMessage }) => {
    const [loginVisible, setLoginVisible] = useState(false);
    const [registerVisible, setRegisterVisible] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const [termsVisible, setTermsVisible] = useState(false);
    const [accept, setAccept] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const { changeTab } = useTab();  // Using changeTab from TabContext

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
        //console.log({from: "handleLoginClose", username: username, password: password});
        const isValidLogin = await verifyLoginAttempt(username, password);
        setLoginVisible(false);

        if (!isValidLogin) {
            setErrorMessage("This username and password combination does not exist");
        } else {

            //console.log({"You're valid asf": true})
    
            setCurrentUser(username);
            navigate('Feed');
            setActiveTab('Feed');
            changeTab('Feed'); 
        }
    }

    const handleRegisterClose = async () => {
        setRegisterVisible(false);

        var errorMessage = "";
        if (username.length < 6) {
            errorMessage += "Username must be at least 6 characters long\n";
        }

        if (password.length < 6) {
            errorMessage += "Password must be at least 6 characters long\n"
        }

        if (!lowerCaseRegex.test(password)) {
            errorMessage += "Password must contain a lower case character\n"
        }

        if (!upperCaseRegex.test(password)) {
            errorMessage += "Password must contain an upper case character\n"
        }

        if (!numberRegex.test(password)) {
            errorMessage += "Password must contain a number\n"
        }

        if (!specialCharRegex.test(password)) {
            errorMessage += "Password must contain a special case cahracter\n"
        }

        if (errorMessage != "") {
            setErrorMessage(errorMessage);
            return;
        }
        
        const isUsernameTaken = await checkUsernameExists(username);
    
        if (!isUsernameTaken) {
            setTermsVisible(true);
        } else {
            setErrorMessage("This username is already taken, try a new one");
        }
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
                    setCurrentUser(username);
                    navigate('Feed');
                    setActiveTab('Feed');
                    changeTab('Feed'); 
                    setAccept(false); // Reset the accept state to prevent future unintended registrations
                } else {
                    setErrorMessage("Failed to create an account. Please try again.");
                }
            }
        };
    
        if (accept) {
            performRegistration();
        }
    }, [accept, username, password, setCurrentUser]);

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
                        <TextInput placeholder="Username" style={styles.input} onChangeText={text => setUsername(text)}/>
                        <TextInput placeholder="Password" secureTextEntry={true} style={styles.input} onChangeText={text => setPassword(text)}/>
                        <TouchableOpacity style={styles.modalButton} onPress={handleLoginClose}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
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
                        <TextInput placeholder="Username" style={styles.input} onChangeText={text => setUsername(text)}/>
                        <TextInput placeholder="Password" secureTextEntry={true} style={styles.input} onChangeText={text => setPassword(text)}/>
                        <TouchableOpacity style={styles.modalButton} onPress={handleRegisterClose}>
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <TermsModal visible={termsVisible} onClose={handleTermsClose} 
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
