// Configuration for the navigation stack, defining the navigation flow and screens within the application.

import { createStackNavigator } from '@react-navigation/stack';
import HomePage from "./Home.js";
import PostPage from './Post.js';
import FeedPage from './feed/Feed.js';
import MailPage from './Mail.js';
import SignIn from './SignIn.js';
import MakePost from './MakePost';
import FollowersPage from './FollowersPage';
import FollowingPage from './FollowingPage';
import UserProfilePage from './UserProfile.js';
import UserFollowingPage from './UserFollowingPage.js'
import UserFollowersPage from './UserFollowersPage.js'

const Stack = createStackNavigator();

const AppStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Feed" component={FeedPage} />
            <Stack.Screen name="Profile" component={HomePage} />
            <Stack.Screen name="Post" component={PostPage} />
            <Stack.Screen name="Create a Post" component={MakePost} />
            <Stack.Screen name="Search" component={MailPage} />
            <Stack.Screen name="Sign In" component={SignIn} />
            <Stack.Screen name="Followers Page" component={FollowersPage} />
            <Stack.Screen name="Following Page" component={FollowingPage} />
            <Stack.Screen name="User Profile Page" component={UserProfilePage} />
            <Stack.Screen name="User Following Page" component={UserFollowingPage} />
            <Stack.Screen name="User Followers Page" component={UserFollowersPage} />
        </Stack.Navigator>
    );
};

export default AppStack;
