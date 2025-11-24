# Welcome to OTD!

<img src="assets/applogo.jpeg" width="400">

## Synopsis
OTD: Your Daily Snapshot into Life's Moments

Introducing OTD (Of The Day), a social app that turns everyday life into a shared routine. Each day includes a set of simple prompts like *Song of the Day* to capture the mood, *Sight of the Day* to show what stood out, *Struggle of the Day* for a dose of honesty, *Outfit of the Day* for the fashion-minded, *Selfie of the Day* for personal snapshots, *Quote of the Day* for whatever inspired you, and many more. You answer them with quick snapshots or notes, creating a small record of what your day actually looked and felt like, without the pressure of a perfect post.

Your posts show up in two places: a private feed for friends and a global feed where you can see how people everywhere responded to the same prompts. Over time, your profile becomes a timeline of these daily moments, and the tag system makes it simple to explore others’ posts by theme. OTD is built to encourage genuine sharing, spark creativity, and make it easy to look back on the small details that usually disappear.



## Meet our team!




Member | Picture | Contact | Skills |
--- | --- | --- | --- |
Esteban |<img src="https://drive.google.com/uc?export=view&id=1uuq9K8GnVZwgzXPBGlCjM9jFJyizwlb9" width="70"> | ejbh24@stanford.edu|Fullstack/OS/AI Project Experience | 
Babar |<img src="https://drive.google.com/uc?export=view&id=10gi24_iGT7aW4Drmd6HxRt607sf7LK0b" width="70"> | nbabar@stanford.edu|Fullstack/AI/ML Project Experience |



## Setup/Instructions for users

- Git clone this project
- Download Expo Go
- On Terminal run "npx expo start" in the otd folder (This may involve downloading packages on your terminal to set up compiling projects from expo)
- Scan QR code generated on your terminal
- Register (must meet username/password requirements, it not, you will simply be informed how to adjust your username and password
- Or (if you want to immediately see a feed with friends), you can sign in as (username: anudeep, password: #Anudeep1)

## Features you can currently test on our app:
- New users can create an account, choosing username/password. There are certain requirements, very similar to other apps/web accounts
- New users prompted to accept terms and conditions
- Current users can login. Easy if using iPhone save password feature
- On app, users can view and toggle between both friends and global feed. Friends feed is just the people they follow. Global feed is every user including themselves. These posts can be sorted by recency or most upvoted. They can also be filtered by a specific prompt. Posts can be liked and commented on.
- A user can delete their own post.
- Users can go to the post tab, where they can see a prompt of the day, and toggle between a for you and trending list of the different prompts. Trending prompts is all prompts. For you are your favorite prompts. These are ranked in popularity. User can also search for prompts on the top.
- A user can click on a prompt, and then upload a picture from camera or library, type a caption, or both, and post it to the feed.
- A user can search for other existent users on the search tab.
- A user can then click on these profiles, view their account, including first name, last name, bio, username, profile pic, and location follow/unfollow the user, see many followers and following they have, and view a list of who they follow/who follows them.
- A user can view their own profile on the profile tab. They can see their first name, last name, bio, username, location, and profile pic. They can also see how many followers and people they following have. One can click on these numbers to display a list of the people they follow/are followed by. A user can then remove followers and following people they follow if they want.
- A user can also edit their profile if they click on the settings button, specifically change their first/last name, bio, location, password, and set a different profile pic.
- Can view all your own posts on your own page.
- Can view all of a user's post on their page.
- Users can and remove their favorite OTDs on the post tab.
- For you page with a default filter of all your interests. Only gives you the option to filter additionally by specific interests.
- Users can log out.
- users can follow and unfollow other users on other user's followers/following list just like you can do you own prrofile's lists
- Loading screen when loading any feed, in the main feed, users own profile, and on other profiles. Fixed a lot of the feed bugs.
- Have users be redirected to accounts of other users when you click on their profile in the feed
- Have users be redirected to accounts of other users or their own aaccount you click on profiles in following/followrs lists
- loading signal for user profiles, following/followers lists, and search tab.
- When registering users can to immediately enter their name, location, and bio.

### TODO - Push to TestFlight/deploy to App Store

## Features we plan on implementing in the near future (did not have enough time to add these by deadline):


(Concerning registration)
- Have feeds be loading in batches. Right now, entire feed is loaded at once, which will break the app once there is alot of users.
- When registering, give users the option to select their favorite OTDS (easier).


(OTD Daily Features)
- For prompts, the number answered count is hardcoded. Update the code so that these are accurate (easier).
- Limit users to only one post per prompt per day???? User should be allowed to post as many prompts as they want per day though (medium)
- Maybe make it so the user has to make a post to even access their feed each day(medium)


(Concerning basic social media features)
- Implement linking songs/articles/youtube videos like in imessage (convert link to a clickable thumbnail) (idk - maybe easy)


(Concerning loading screens)
- making loading signal more complex, dynamic logo screen instead of a green revolving circle maybe (medium??? diffuclty)
-  also maybe optimize so that the DOM is being set up while loading? (rn it just calls the backend functions while loading, which is most of the payload but both would be ideal) (alt solution maybe have frontent appear in phases, like while dom is loading, objects can have dark rendering background, like fizz does)


(May require more recourses/app store deployment maybe), so for later...)
- Get access to a better photo drive. Right now photos bigger than 10 mg cannot be uploaded. most photos are find but extremely high resolution like a sun rise with an amazing view may be too big. right now we are using a free cloud drive. we will invest in better recourses as we grow our app.
- When registering, give users the option to follow their contacts
- Implement external sharing for posts (idk if its even possible to do on expo go, but we prob have to add a link field to posts in databases to do this in the future), button currenttly commented out


(Discussion on how this feature will work required...)
- Implement leaderborad/refferal system
- Implement badge functionaility (right now badges are hardcoded and are the same under everyones own profile), didnt have enough time for this (harder)
- adding a time filter for most upvoted like reddit has


## Bugs to fix:
- None right now!
