# Firebase Setup

Complete guide to setting up Firebase Authentication and Firestore for ShipSafe.

## Overview

ShipSafe uses Firebase for secure user authentication and database operations. This guide will walk you through setting up Firebase from scratch, including authentication, Firestore database, and server-side admin configuration.

**What you'll set up:**
- Firebase project creation
- Authentication (Email/Password, Google OAuth)
- Firestore database
- Service account for server-side operations
- Security rules
- Environment variables

## Prerequisites

- Google account (for Firebase Console)
- Node.js project set up
- Basic understanding of Firebase concepts

## Step 1: Create Firebase Project

### 1.1 Go to Firebase Console

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Google account
3. Click **Add project** or **Create a project**

### 1.2 Configure Project

1. **Project name**: Enter your project name (e.g., "MySaaS")
   - This name is for internal use and can be changed later

2. **Google Analytics** (Optional):
   - Enable Google Analytics if you want usage tracking
   - Choose an Analytics account or create new one

3. Click **Create project**

4. Wait for project creation (usually takes 30-60 seconds)

5. Click **Continue** when project is ready

## Step 2: Enable Authentication

### 2.1 Set Up Authentication

1. In Firebase Console, click **Authentication** in the left sidebar
2. Click **Get started** (first time setup)
3. You'll see the Authentication dashboard

### 2.2 Enable Email/Password Provider

1. Click on **Sign-in method** tab
2. Click on **Email/Password** provider
3. Enable **Email/Password** toggle (first option)
4. Optionally enable **Email link (passwordless sign-in)**
5. Click **Save**

**Note:** Email/Password is required for ShipSafe.

### 2.3 Enable Google Provider (Optional but Recommended)

1. Still in **Sign-in method** tab
2. Click on **Google** provider
3. Enable the toggle
4. Choose a **Project support email** (uses your Google account by default)
5. Click **Save**

**Benefits of Google OAuth:**
- One-click sign-in for users
- Better user experience
- No password management needed

### 2.4 Configure Authorized Domains

1. In **Authentication** → **Settings** tab
2. Scroll to **Authorized domains**
3. Add your domains:
   - `localhost` (already included for development)
   - Your production domain (e.g., `yourdomain.com`)
   - Your Vercel deployment domain (e.g., `your-app.vercel.app`)

**Important:** Firebase only allows authentication from authorized domains for security.

## Step 3: Create Firestore Database

### 3.1 Create Database

1. In Firebase Console, click **Firestore Database** in the left sidebar
2. Click **Create database**

### 3.2 Choose Security Rules

**For Development:**
- Choose **Start in test mode** (allows read/write for 30 days)
- **Note:** Switch to production mode before going live

**For Production:**
- Choose **Start in production mode** (requires security rules)
- We'll configure rules in Step 6

### 3.3 Select Database Location

1. Choose a location closest to your users
2. **Recommended:** `us-central1` (Iowa) for North America
3. Click **Enable**

**Important:** Location cannot be changed after creation.

## Step 4: Get Client Configuration

### 4.1 Get Web App Config

1. In Firebase Console, click the gear icon ⚙️ next to **Project Overview**
2. Select **Project settings**
3. Scroll to **Your apps** section
4. Click the **Web** icon `</>` (if no web app exists)
5. Register app:
   - **App nickname**: Your app name
   - **Firebase Hosting** (optional): Check if using Firebase Hosting
6. Click **Register app**

### 4.2 Copy Configuration

You'll see a configuration object like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXXXXX"
};
```

**Save these values** - we'll add them to `.env.local` in Step 7.

## Step 5: Get Service Account Key (Admin SDK)

The Admin SDK is required for server-side operations (token verification, user management).

### 5.1 Generate Private Key

1. In Firebase Console, go to **Project settings** (gear icon)
2. Click on **Service accounts** tab
3. Click **Generate new private key**
4. A warning dialog will appear - click **Generate key**
5. A JSON file will download automatically

**Security Warning:**
- Never commit this JSON file to Git
- Treat it like a password
- Only use in server-side code

### 5.2 Extract Values from JSON

Open the downloaded JSON file. You'll see:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

**Save these values:**
- `project_id` → `FIREBASE_PROJECT_ID`
- `client_email` → `FIREBASE_CLIENT_EMAIL`
- `private_key` → `FIREBASE_PRIVATE_KEY` (keep newlines as `\n`)

### 5.3 Get Database URL

1. In Firebase Console, go to **Firestore Database**
2. Click on **Data** tab
3. The URL in the address bar contains your database URL
4. Format: `https://your-project-id.firebaseio.com`

Or find it in your project settings under **Realtime Database** (if enabled).

## Step 6: Configure Firestore Security Rules

### 6.1 Access Security Rules

1. In Firebase Console, go to **Firestore Database**
2. Click on **Rules** tab

### 6.2 Basic Security Rules

Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Subscriptions - users can read their own
    match /subscriptions/{subscriptionId} {
      allow read: if request.auth != null;
      allow write: if false; // Only server can write
    }
    
    // Default: Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 6.3 Publish Rules

1. Click **Publish** to save rules
2. Rules take effect immediately

**Important:** Test your rules thoroughly before production. Start with restrictive rules and add permissions as needed.

## Step 7: Configure Environment Variables

### 7.1 Add Firebase Client Variables

Add to your `.env.local` file:

```bash
# Firebase Client SDK (Public - safe to expose to browser)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...              # From Step 4.2
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX  # Optional: Analytics
```

### 7.2 Add Firebase Admin Variables

```bash
# Firebase Admin SDK (Server-only - never expose to browser)
FIREBASE_PROJECT_ID=your-project-id                # From Step 5.2
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com  # From Step 5.3
```

**Critical:** 
- The `FIREBASE_PRIVATE_KEY` must include escaped newlines (`\n`)
- Wrap the entire key in quotes
- Copy the key exactly as it appears in the JSON file

### 7.3 Verify Variables

Restart your development server:

```bash
npm run dev
```

Check the console for any Firebase initialization errors.

## Step 8: Test Firebase Setup

### 8.1 Test Authentication

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000/auth`
3. Try creating an account with email/password
4. Check Firebase Console → Authentication → Users to see the new user

### 8.2 Test Database

If you've implemented database operations, test creating/reading documents in Firestore.

### 8.3 Check Console

- Look for any errors in browser console
- Check server logs for Firebase Admin SDK errors
- Verify no missing environment variable errors

## Troubleshooting

### Authentication Not Working

**Issue:** Users can't sign in

**Solutions:**
1. **Check authorized domains** - Ensure `localhost` and your domain are authorized
2. **Verify API keys** - Double-check environment variables are correct
3. **Check browser console** - Look for Firebase initialization errors
4. **Verify providers** - Ensure Email/Password is enabled in Firebase Console

### Admin SDK Errors

**Issue:** Server-side Firebase operations failing

**Solutions:**
1. **Check private key format** - Must include `\n` for newlines
2. **Verify email** - `FIREBASE_CLIENT_EMAIL` must match service account
3. **Check project ID** - Must match Firebase project ID
4. **Test locally** - Ensure variables are in `.env.local`, not `.env`

### Firestore Permission Denied

**Issue:** Cannot read/write to Firestore

**Solutions:**
1. **Check security rules** - Verify rules allow the operation
2. **Verify authentication** - User must be authenticated for protected rules
3. **Test in Firebase Console** - Use Rules Playground to test
4. **Check rules syntax** - Ensure rules are valid and published

### Environment Variables Not Loading

**Issue:** Firebase config is undefined

**Solutions:**
1. **Restart dev server** - Variables only load on startup
2. **Check file name** - Must be exactly `.env.local` (not `.env`)
3. **Verify location** - File must be in project root
4. **Check prefixes** - Client vars need `NEXT_PUBLIC_` prefix

## Production Checklist

Before going live, ensure:

- [ ] Production Firebase project created (separate from dev)
- [ ] Production environment variables set in hosting platform
- [ ] Security rules configured and tested
- [ ] Authorized domains updated with production domain
- [ ] Service account key is secure (never in Git)
- [ ] Test mode disabled in Firestore (production mode)
- [ ] Authentication providers configured
- [ ] Error tracking configured for Firebase errors

## Best Practices

1. **Separate Projects** - Use different Firebase projects for dev and production
2. **Security Rules** - Start restrictive and add permissions as needed
3. **Monitor Usage** - Set up Firebase alerts for quota limits
4. **Backup Data** - Export Firestore data regularly
5. **Rotate Keys** - Rotate service account keys periodically

## Next Steps

Now that Firebase is set up:

1. **[Authentication Features](./authentication)** - Learn how authentication works
2. **[Database Features](./database)** - Learn Firestore operations
3. **[Environment Variables](./environment-variables)** - Complete env var guide
4. **[Authentication Tutorial](../tutorials/authentication)** - Build auth features

## Learn More

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Authentication Features](./authentication)
- [Database Features](./database)
