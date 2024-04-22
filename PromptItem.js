import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Include `navigation` in the component's props
const PromptItem = ({ title, icon, answeredCount, navigation, onRemove }) => {
    return (
        <View style={styles.promptItem}>
            <TouchableOpacity
                style={styles.mainContent}
                onPress={() => navigation.navigate('Create a Post', { promptTitle: title, promptIcon: icon })}
            >
                <Text style={styles.promptIcon}>{icon}</Text>
                <View style={styles.promptTextContainer}>
                    <Text style={styles.promptTitle}>{title}</Text>
                    <Text style={styles.promptCount}>{answeredCount} users answered!</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.addButton}
                onPress={onRemove}>
                <Icon name="close-outline" size={20} color="red" />
            </TouchableOpacity>
        </View>
    );
};



const styles = StyleSheet.create({
    promptItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        backgroundColor: 'black',
        justifyContent: 'space-between',
        
    },
    mainContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    promptIcon: {
        fontSize: 24,
        marginRight: 20,
    },
    promptTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    promptTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white'
    },
    promptCount: {
        fontSize: 14,
        color: 'grey',
    },
    addButton: {
        padding: 10,
        marginLeft: 10,
    },
});

export default PromptItem;