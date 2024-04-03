// A component that renders an individual prompt item, allowing users to navigate to a posting screen with the selected prompt details.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Include `navigation` in the component's props
const PromptItem = ({ title, icon, answeredCount, navigation }) => {
    return (
        <TouchableOpacity 
            style={styles.promptItem}
            onPress={() => navigation.navigate('Create a Post', { promptTitle: title, promptIcon: icon })}
        >
            <Text style={styles.promptIcon}>{icon}</Text>
            <View style={styles.promptTextContainer}>
                <Text style={styles.promptTitle}>{title}</Text>
                <Text style={styles.promptCount}>{answeredCount} users answered!</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    promptItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1', // A light grey color for the separator line
        backgroundColor: 'transparent',
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
    },

    promptCount: {
        fontSize: 14,
        color: 'grey',
    },
});

export default PromptItem;