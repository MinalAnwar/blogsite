# BlogCraft - Portable Blogging Platform

A complete, portable blogging platform built with React, Firebase, and modern web technologies. Run it locally, deploy anywhere, or use Firebase Hosting.

## Features

- **Rich Text Editor** - Create beautiful content with formatting tools, media embedding, and live preview
- **Firebase Authentication** - Secure Google sign-in that works anywhere
- **Firestore Database** - Real-time, scalable NoSQL database
- **Analytics Dashboard** - Track content performance and engagement metrics
- **Sentiment Analysis** - Automated feedback analysis and categorization
- **Smart Automation** - Workflow automation with intelligent rules
- **Responsive Design** - Works perfectly on desktop and mobile
- **Dark/Light Mode** - User preference theming

## Quick Start

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication with Google sign-in
4. Enable Firestore Database
5. Get your Firebase config credentials

### 2. Environment Setup

Create a `.env` file with your Firebase credentials:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Firebase Hosting Deployment

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Build and deploy
npm run build
firebase deploy
```

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and Firebase integration
├── firebase.ts            # Firebase configuration
├── firestore.rules        # Database security rules
├── firestore.indexes.json # Database indexes
└── firebase.json          # Firebase hosting configuration
```

## Authentication

The platform uses Firebase Authentication with Google sign-in. Users can securely access their content from anywhere.

## Database

All data is stored in Firestore with proper security rules:

- **Posts**: User's blog posts with rich content
- **Feedback**: Reader feedback with sentiment analysis
- **Automation Rules**: User-defined workflow automation

## Deployment Options

1. **Firebase Hosting** (Recommended)
   - Global CDN
   - Automatic SSL
   - Custom domains
   - Serverless

2. **Local Development**
   - Run anywhere with Node.js
   - No external dependencies
   - Full offline development

3. **Static Hosting**
   - Vercel, Netlify, GitHub Pages
   - Build once, deploy anywhere
   - Environment variable support

## Security

- Firebase Authentication handles user security
- Firestore rules ensure data isolation
- No server-side vulnerabilities
- HTTPS everywhere

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase Functions (optional)
- **Database**: Firestore NoSQL
- **Authentication**: Firebase Auth
- **Hosting**: Firebase Hosting
- **Build**: Vite

## Contributing

This is a complete, production-ready blogging platform. You can customize it for your specific needs or contribute improvements.

## License

Open source - feel free to use and modify for your projects.