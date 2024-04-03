// Component for editing user profile details with a modal interface, leveraging context for user state management.

import React, { useState, useContext } from 'react';
import { View, Text, Button, Modal, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { updateUserProfile } from './database';
import { UserContext } from './userContext';

const EditProfileModal = ({ visible, onClose, onUpdateUser }) => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');

  const onSave = async () => {
    const updates = {};
    if (firstName) updates.first_name = firstName;
    if (lastName) updates.last_name = lastName;
    if (bio) updates.bio = bio;
    if (location) updates.location = location;
    if (userName) updates.username = userName;
    if (password) updates.password = password; 

    const result = await updateUserProfile(currentUser, updates); // Replace currentUsername with actual variable
    if (result.success) {
      console.log(result.user.username)
      setCurrentUser(result.user.username)
      onUpdateUser(result.user); 
      onClose(); // Close the modal and maybe refresh profile data
    } else {
        console.error(result.error);
        // Handle error (show message to user, etc.)
    }
};

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          <TextInput
            style={styles.input}
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            label="Bio"
            value={bio}
            onChangeText={setBio}
            multiline={true}
          />
          <TextInput
            style={styles.input}
            label="Location"
            value={location}
            onChangeText={setLocation}
          />
          <TextInput
            style={styles.input}
            label="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
            <View style={styles.buttonContainer}>
              <Button title="Save" onPress={onSave} />
              <Button title="Cancel" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  input: {
    marginBottom: 10,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default EditProfileModal;
