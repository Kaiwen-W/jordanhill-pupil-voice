## A full stack web app where pupils of my school can upload their own personal achievements and others can view it while interacting by hearting (liking) the post. 
- made with React and Next.js with Javascript, Tailwind CSS for styling, and Firebase as a backend. 

# Features
Initial Page
- users can access the enter page, and go straight to the different house pages

- on each page except the initial one, there is a glowing blob which follows the mouse. The style of this blob is based on the user's house colours or is randomly selected
  
Enter Page
- components are dynamically generated based on which stage of account completion the user has
  - if the user doesn't have an account they are asked to sign in/up with google
  - if they have a account but no username, a custom username form is displayed
  - otherwise three buttons are displayed: one to go to their account overview, one to create/manage posts, and one to sign out
    
4 Main House Pages (one for each house) 
- generated with server side rendering
- has a discord inspired sidebar which links to different pages (colour scheme changes based on house colours)
  - which link to different catagories of achievements, e.g. ones in sports, music, academia etc
  - dynamically changes on whether a user is signed in or not
- published posts are sorted from top to bottom by created at datestamps

User Profile Page
- generated with server side rendering
- posts organised by created at timestamp
- user's username, display name and profile picture displayed at the top

Specific Post Page (a post is made and is specifically clicked on) 
- generated with incremental static regeneration
- displays the post content
  - is hydrated with realtime data from the firestore database
- displays a component which allows other users to heart the post or for the poster themself to go to the edit page
  - implemented by adding a heart document under the post document and incrementing the heart count up by one

Editing/Admin Page
- user can view both their unpublished and published sorted by the time created
- now, there is a button which the user can click to go to the edit page
- at the bottom, users can create a new post with a title
  - when created, a toast is displayed at the top of the page 

Specific Post Editing Page
- inputs to change:
  - uploading images and gifs to the firestore storage and included in the markdown
  - changing the category of the post
  - changing the text/content of the post
  - changing whether the post is published or unpublished
- tools on the side which allow:
  - the user to preview what their markdown will look like to other users
  - a hyperlink to see the live view to other users
  - a delete button
- each time something is updated a toast appears on the top of the screen

404 Page
- custom 404 error page which has a link back to the homepage

Backend Security Features
- specific rules made for firebase to only allow the correct users to read, write, update or delete data

