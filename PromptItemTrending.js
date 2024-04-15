import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Include `navigation` in the component's props
const PromptItemTrending = ({ title, icon, answeredCount, navigation, isFavorite, onAdd, onRemove }) => {
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
                onPress={isFavorite ? onRemove : onAdd}>
                <Icon name={isFavorite ? "close-outline" : "add-outline"} size={20} color={isFavorite ? "red" : "green"} />
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
        borderBottomColor: '#e1e1e1',
        backgroundColor: 'transparent',
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

export default PromptItemTrending;