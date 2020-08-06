# contactKeeper
Simple MERN application that allows authentication and tracks unique data for each registered account


## Backened (express)
### Server.js
- Very basic Express server that connects to MongoDB as defined in [config folder](/config/db.js)
- Sets up routes that the express server will be using - [/api/users](/routes/users) , [/api/auth](/routes/auth) , [/api/contacts](/routes/contacts)
- When in production, loads a static folder called client/build (to be explained...)
- When in production, creates a wildcard route to direct any unmentioned api calls to rendering ./client/build/index.html
- Unless other env Port specified, uses port 5000 and listens on port 5000
### Routes
### Models
### middleware
### MongoDB
### config
### installation

## Front-End (react)
### App.js
### components
### context
### utils
### installation

## Deployment (heroku)
### heroku setup
## Other
### package.json
### .gitignore
