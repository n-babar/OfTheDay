// Centralized database operations for user management, posts, comments, likes, and following relations using Supabase.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import 'react-native-url-polyfill/auto'

const supabaseUrl = 'https://ixrbdcrfmkuprdphuvec.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cmJkY3JmbWt1cHJkcGh1dmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAwMjk1NDYsImV4cCI6MjAyNTYwNTU0Nn0.daNnhmF6KsFRfc1clI1vP7zISFsWwU_9eRHOgVeIwXY';

// add user data to database
export async function addUserToDatabase(username, password) {
    //console.log({"from": "the database", username: username, password: password});
    try {
        const { data: newData, error } = await supabase
            .from('users')
            .insert([{
                created_at: ((new Date()).toISOString()).toLocaleString('zh-TW'), 
                first_name: "", 
                username: username, 
                last_name: "", 
                bio: "Open settings on the top right to setup your profile name, bio, location, and profile pic!", 
                location: "", 
                password: password,
            }]);

        if (error) {
            throw error;
        }

        //console.log('Data added successfully:', newData);
        return true;
    } catch (error) {
        console.error('Error adding data:', error.message);
        return false;
    }
}

// ensure that username has corresponding user in database
export async function checkUsernameExists(username) {
    try {
        const { data, error } = await supabase.from("users").select("username").eq("username", username);
        //console.log({"data": data});

        if (error) {
            throw error;
        }

        return data.length > 0;
    } catch (error) {
        console.error("Error checking username:", error.message);
        return false;
    }
}

// find user data based on username
export async function getUser(username) {
    try {
        //console.log({"inside user database": username})
        const {data, error} = await supabase.from("users").select("*").eq("username", username);

        if (error) {
            throw error;
        }

        //console.log({"returning from user database": data})

        return {failed: false, user: data};
    } catch (error) {
        //console.log("Internal error:", "user does not exist in database");
        return {failed: true, user: null};
    }
}

// ensure username and pwd are correct
export async function verifyLoginAttempt(username, password) {
    //console.log({"inside verifyLogin": username, "password": password});
    try {
        const { data, error } = await supabase.from("users").select("*").match({"username": username, "password": password});
        //console.log({"user": data, "ret": data != null});

        if (error) {
            throw error;
        }
        
        return data.length > 0;
    } catch (error) {
        //console.log("Error logging in:", error.message);
        return false;
    }
}

// return all posts 
export async function getAllPosts() {
    try {
        //console.log("inside getting posts");
        const {data, error} = await supabase.from("posts").select("*");

        if (error) {
            throw error;
        }

        //console.log({"returning post database": data})

        return {failed: false, posts: data};
    } catch (error) {
        //console.log("Internal error:", "post does not exist in database");
        return {failed: true, posts: null};
    }
}

// add post to database with corresponding data
export async function addPost(post) {
    //console.log({"adding post to database:": post});

    try {
        const { data: newData, error } = await supabase
            .from('posts')
            .insert([{
                created_at: ((new Date()).toISOString()).toLocaleString('zh-TW'), 
                text: post.text,
                image: post.image,
                num_likes: 0,
                num_comments: 0,
                otd_id: post.otd,
                username: post.username
            }]);

        if (error) {
            throw error;
        }

        //console.log('Post added successfully:', newData);
        return true;
    } catch (error) {
        console.error('Error adding post:', error.message);
        return false;
    }
}

// Function to delete a post and its related comments from the database
export async function deletePost(postId) {
    try {
        // Start a transaction
        const { error: deleteCommentsError } = await supabase
            .from('comments')
            .delete()
            .match({ post_foreign: postId }); 

        if (deleteCommentsError) {
            throw deleteCommentsError;
        }

        const { data, error } = await supabase
            .from('posts')
            .delete()
            .match({ id: postId });

        if (error) {
            throw error;
        }

        // console.log('Post and related comments deleted successfully:', data);
        return true;
    } catch (error) {
        console.error('Error deleting post or related comments:', error.message);
        return false;
    }
}

// get a single prompt with otd id
export async function getOTD(otd_id) {
    try {
        //console.log("inside getting otd");
        const {data, error} = await supabase.from("otds").select("*").match({"id": otd_id});

        if (error) {
            throw error;
        }

        //console.log({"returning otd database": data})

        return {failed: false, otd: data};
    } catch (error) {
        //console.log("Internal error:", "post does not exist in database");
        return {failed: true, otd: null};
    }
}

// get all prompts with corresponding data
export async function getAllOTDs() {
    try {
        //console.log("inside getting otd");
        const {data, error} = await supabase.from("otds").select("*");

        if (error) {
            throw error;
        }

        //console.log({"returning otd database": data})

        return {failed: false, otds: data};
    } catch (error) {
        //console.log("Internal error:", "post does not exist in database");
        return {failed: true, otds: null};
    }
}

// given a username, return all users that the user is following
export async function getFriendships(username) {
    try {
        //console.log({"inside following database": username})
        // Query to fetch friends
        const { data, error } = await supabase
        .from('following')
        .select('*')
        .eq('username1', username);

        if (error) {
            throw error;
        }

        const friends = data.map(row => row.username2);

        //console.log({"returning following database": friends})

        return {failed: false, friends: friends};
    } catch (error) {
        //console.log({"Error with getting user's friends": error});
        return {failed: true, friends: null};
    }
}

// given a username, return all followers of user
export async function getFollowers(username) {
    try {
        //console.log({"inside following database": username})
        // Query to fetch friends
        const { data, error } = await supabase
        .from('following')
        .select('*')
        .eq('username2', username);

        if (error) {
            throw error;
        }

        const friends = data.map(row => row.username1);

        //console.log({"returning following database": friends})

        return {failed: false, friends: friends};
    } catch (error) {
        //console.log({"Error with getting user's friends": error});
        return {failed: true, friends: null};
    }
}

// given a username, return all followers of the user with their details
export async function getFollowersDetails(username) {
    try {
        // First, get the list of usernames who are followers
        let { data: followersData, error: followersError } = await supabase
            .from('following')
            .select('username1')
            .eq('username2', username);

        if (followersError) {
            throw followersError;
        }

        // Ensure followersData is an array before mapping
        followersData = Array.isArray(followersData) ? followersData : [];

        // Map through the list of followers to get their usernames
        let usernames = followersData.map(follower => follower.username1);

        // Then, get the details of each follower from the 'users' table
        let { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('username, first_name, last_name, profile_pic')
            .in('username', usernames);

        if (usersError) {
            throw usersError;
        }

        return { failed: false, followers: usersData };
    } catch (error) {
        console.error("Error fetching followers' details:", error);
        return { failed: true, followers: null };
    }
}

// given a username, return all followers of the user with their details
export async function getFollowingDetails(username) {
    try {
        // First, get the list of usernames who are followers
        let { data: followingData, error: followingError } = await supabase
            .from('following')
            .select('username2')
            .eq('username1', username);

        if (followingError) {
            throw followingError;
        }

        // Ensure followersData is an array before mapping
        followingData = Array.isArray(followingData) ? followingData : [];

        // Map through the list of followers to get their usernames
        let usernames = followingData.map(following => following.username2);

        // Then, get the details of each follower from the 'users' table
        let { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('username, first_name, last_name, profile_pic')
            .in('username', usernames);

        if (usersError) {
            throw usersError;
        }
        return { failed: false, following: usersData };
    } catch (error) {
        console.error("Error fetching followers' details:", error);
        return { failed: true, following: null };
    }
}

// Check if the current user has liked a specific post
export async function checkIfUserLikedPost(username, postId) {
    try {
        const { data, error } = await supabase
            .from('likes')
            .select('id') // Selecting 'id' or any column that definitely exists
            .match({ username_foreign: username, post_foreign: postId })
            
        if (error) {
            throw error;
        }

        // If there is at least one entry, it means the user has liked the post
        if (data && data.length > 0) {
            return true; // Liked
        } else {
            return false; // Not liked yet
        }
    } catch (error) {
        console.error('Error checking if user liked post:', error.message);
        return false; // In case of error, default to not liked
    }
}

// Toggle the like status for a post
export async function toggleLike(postId, username, isLiked) {
    try {
        // First, handle the like/unlike logic in the 'likes' table
        if (isLiked) {
            // If liking the post, insert a record into the 'likes' table
            const { error: insertError } = await supabase
                .from('likes')
                .insert([
                    { created_at: new Date().toISOString(), username_foreign: username, post_foreign: postId }
                ]);
            if (insertError) {
                throw insertError;
            }
        } else {
            // If unliking the post, remove the record from the 'likes' table
            const { error: deleteError } = await supabase
                .from('likes')
                .delete()
                .match({ username_foreign: username, post_foreign: postId });
            if (deleteError) {
                throw deleteError;
            }
        }

        // Then, update the 'num_likes' count in the 'posts' table
        // This requires fetching the current count of likes for accuracy
        const { data: likesData, error: likesError } = await supabase
            .from('likes')
            .select('*', { count: 'exact' })
            .eq('post_foreign', postId);

        if (likesError) {
            throw likesError;
        }

        const totalLikes = likesData.length; // Or use the count property if exact count is available

        // Update the 'posts' table with the new count
        const { error: updateError } = await supabase
            .from('posts')
            .update({ num_likes: totalLikes })
            .match({ id: postId });

        if (updateError) {
            throw updateError;
        }

        return true; // Indicate success
    } catch (error) {
        console.error('Error toggling like status:', error.message);
        return false; // Indicate failure
    }
}

// Check if the currentUser is following the viewed profile
export async function checkIfFollowing(currentUser, viewedUser) {
    const { data, error } = await supabase
        .from('following')
        .select('*')
        .match({ username1: currentUser, username2: viewedUser });

    return data.length > 0;
}

// Follow a user
export async function followUser(currentUser, userToFollow) {
    const { data, error } = await supabase
        .from('following')
        .insert([{ username1: currentUser, username2: userToFollow }]);

    if (error) {
        console.error('Error following user:', error);
        return false;
    }
    return true;
}

// Unfollow a user
export async function unfollowUser(currentUser, userToUnfollow) {
    const { data, error } = await supabase
        .from('following')
        .delete()
        .match({ username1: currentUser, username2: userToUnfollow });

    if (error) {
        console.error('Error unfollowing user:', error);
        return false;
    }
    return true;
}

export async function removeFollower(username, removeUsername) {
    try {
        // Delete the relationship where removeUsername is following username
        const { error } = await supabase
            .from('following')
            .delete()
            .match({ username1: removeUsername, username2: username });

        if (error) {
            throw error;
        }

        //console.log(`Successfully removed follower: ${removeUsername} from user: ${username}`);
        return true;
    } catch (error) {
        console.error('Error removing follower:', error);
        return false;
    }
}

export async function fetchUserProfilePic(currentUser) {
    let { data: user, error } = await supabase
        .from('users') 
        .select('profile_pic')
        .eq('username', currentUser) // Assuming 'username' is the primary key
        .single(); 

    if (error) {
        console.error('Error fetching user profile picture:', error);
        return null; 
    }

    // Assuming the 'profile_pic' column contains the URL directly
    return user.profile_pic;
};

// Function to post a comment to the backend
export async function postCommentToBackend(postId, username, commentText, img) {
    //console.log("yay");
    // try {
    //     const { data, error } = await supabase
    //         .from('comments')
    //         .insert([
    //             {
    //                 created_at: new Date().toISOString(), 
    //                 username_foreign: username, 
    //                 post_foreign: postId, 
    //                 comment: commentText
    //             }
    //         ]);
        
    //     if (error) {
    //         throw error;
    //     }
        
    //     console.log('Comment posted successfully:', data);
    //     return true;
    // } catch (error) {
    //     console.error('Error posting comment:', error.message);
    //     return false;
    // }
    //console.log("yay");
    //console.log(username);

    try {
        const { data: commentData, error: commentError } = await supabase
            .from('comments')
            .insert([
                {
                    created_at: new Date().toISOString(), 
                    username_foreign: username, 
                    post_foreign: postId, 
                    comment: commentText,
                    image: img
                }
            ]);

        if (commentError) {
            throw commentError;
        }

        //console.log("yay");
        //console.log(postId);

        // Fetch the current num_comments
        let { data: postsData, error: fetchError } = await supabase
            .from('posts')
            .select('num_comments')
            .eq('id', postId)
            .single();
        
        //console.log('hello');

        //console.log(postsData.num_comments);
        if (fetchError) {
            throw fetchError;
        }
        

        // Update the num_comments
        const newNumComments = postsData.num_comments + 1;
        const { error: updateError } = await supabase
            .from('posts')
            .update({ num_comments: newNumComments })
            .match({ id: postId });

        if (updateError) {
            throw updateError;
        }

        // console.log('Comment posted and post updated successfully');
        return true;
    } catch (error) {
        console.error('Error posting comment or updating post:', error.message);
        return false;
    }
}

export async function countCommentsForPost(postId, setCommentsCount) {
    try {
        const response = await supabase
            .from('comments')
            .select('*', { count: 'exact' })
            .eq('post_foreign', postId);
        const count = response.count;

        if (response.error) {
            throw response.error;
        }

        if (count !== null) {
            setCommentsCount(count);
        }
    } catch (error) {
        console.error('Error fetching comments count:', error);
    }
}

export async function fetchComments(postId, setLoadingComments, setComments) {
    setLoadingComments(true);
    try {
        const { data, error } = await supabase
            .from('comments')
            .select('username_foreign, comment, created_at, image')
            .eq('post_foreign', postId) 
            .order('created_at', { ascending: false }); // Example of ordering by created_at
        
        if (error) {
            console.error('Error fetching comments:', error);
        } else {
            setComments(data);
        }
    } catch (error) {
        console.error('Exception fetching comments:', error);
    } finally {
        setLoadingComments(false);
    }
};

// find user data based on username prefix
export async function searchUsersByUsernamePrefix(usernamePrefix) {
    try {
        //console.log({"searching for users with prefix": usernamePrefix});
        // Select specific columns needed
        const {data, error} = await supabase
            .from("users")
            .select("username, first_name, last_name, profile_pic")
            .ilike("username", `${usernamePrefix}%`);

        if (error) {
            throw error;
        }

        //console.log({"users found": data});
        return {failed: false, users: data};
    } catch (error) {
        //console.log("Error searching for users:", error.message);
        return {failed: true, users: null};
    }
}

export async function updateUserProfile(username, updates) {
    try {
        const updateResponse = await supabase
            .from('users')
            .update(updates)
            .match({ username: username });

        if (updateResponse.error) throw updateResponse.error;

        // Assuming the update was successful, fetch the updated user data
        const { data: updatedData, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single(); // Assuming username is unique and returns a single record

        if (fetchError) throw fetchError;

        return { success: true, user: updatedData };
    } catch (error) {
        console.error('Error updating user profile:', error.message);
        return { success: false, error: error.message };
    }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    }
});

// Function to fetch posts by a specific user, ordered from most recent to least
export async function fetchUserPosts(username) {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('username', username)
            .order('created_at', { ascending: false }); // Sorting by created_at descending

        if (error) {
            throw error;
        }

        return { failed: false, posts: data };
    } catch (error) {
        console.error('Error fetching user posts:', error.message);
        return { failed: true, posts: null };
    }
}