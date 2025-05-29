# Firebase Setup Guide

This guide shows you how to integrate Firebase and Firestore with your blogging platform to make it completely portable and run anywhere.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter your project name (e.g., "my-blog-platform")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Click on "Google" provider
5. Toggle "Enable"
6. Add your email as a test user
7. Click "Save"

## Step 3: Enable Firestore Database

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select your preferred location
5. Click "Done"

## Step 4: Get Firebase Configuration

1. Go to Project Settings (gear icon near "Project Overview")
2. Scroll down to "Your apps" section
3. Click "Add app" and select Web (</> icon)
4. Register your app with a nickname
5. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  appId: "1:123456789:web:abcdefghijklmnop"
};
```

## Step 5: Add Environment Variables

Create a `.env` file in your project root with these values:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

## Step 6: Deploy Security Rules

The firestore.rules file contains security rules that ensure users can only access their own data:

```bash
firebase deploy --only firestore:rules
```

## What You Get

Once set up, your blogging platform will have:

- **Google Authentication**: Secure sign-in that works anywhere
- **Firestore Database**: Real-time, scalable NoSQL database
- **Global Deployment**: Deploy to Firebase Hosting worldwide
- **Offline Support**: Works offline and syncs when online
- **Real-time Updates**: Changes sync instantly across devices

## Local Development

After adding your Firebase credentials, run:

```bash
npm run dev
```

Your blog will work locally with full Firebase integration.

## Firebase Hosting Deployment

Deploy your blog globally:

```bash
npm run build
firebase deploy
```

Your blog will be available at: `https://your-project-id.web.app`

## Benefits of Firebase Integration

1. **No Server Management**: Serverless architecture
2. **Global Scale**: Automatic scaling worldwide
3. **Real-time Data**: Live updates across all users
4. **Offline First**: Works without internet connection
5. **Security**: Built-in authentication and database rules
6. **Free Tier**: Generous free usage limits