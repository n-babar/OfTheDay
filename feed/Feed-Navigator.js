// Initializes and configures navigation for the feed section, including Friends and Global feeds.

import { createStackNavigator } from '@react-navigation/stack';
import FriendsFeedPage from "./FriendsFeed.js";
import GlobalFeedPage from './GlobalFeed.js';
import ForYouFeedPage from './ForYouFeed.js';

const Stack = createStackNavigator();

const FeedStack = () => {
    return (
        <Stack.Navigator 
            screenOptions={{
                headerShown: false
            }}>
        <Stack.Screen name="FriendsFeed" component={FriendsFeedPage} />
        <Stack.Screen name="ForYouFeed" component={ForYouFeedPage} />
        {/* <Stack.Screen name="GlobalFeed" component={GlobalFeedPage} /> */}
        </Stack.Navigator>
    );
};

export default FeedStack;
