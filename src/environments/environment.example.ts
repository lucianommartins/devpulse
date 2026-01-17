// Environment Configuration Template
// Copy this file to environment.ts and environment.prod.ts
// Fill in your own values - NEVER commit the actual files!

export const environment = {
  production: false,

  // App encryption secret - used for client-side encryption
  // Generate a unique string for your deployment
  appSecret: 'YOUR_UNIQUE_APP_SECRET_HERE',

  // Firebase Configuration
  // Get these values from Firebase Console > Project Settings
  firebase: {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.firebasestorage.app',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID'
  }
};
