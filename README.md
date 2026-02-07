# Sparks Audio Web App

A kid-friendly web app for CCAC Awana Sparks audio, built with Next.js.
Content is managed via Google Sheets and audio is streamed directly from Google Drive.

## Features
- **Dynamic Content**: Fetches Tracks/Sections/Units from [Google Sheet](https://docs.google.com/spreadsheets/d/1kJ1ycExJ5aOZT1NB4NoqHjBaEXVgn3naz-ESI0JJhX4/edit?usp=sharing).
- **Audio Streaming**: Plays `drive_file_id` links directly.
- **Progress Tracking**: Saves progress per device (localStorage). Marks tracks complete >90%.
- **Kid-Friendly UI**: Big buttons, clear colors (HangGlider Green, WingRunner Blue, SkyStormer Red).

## Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Run Locally**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or 3001 if 3000 is taken).

## data Management
The app reads from the `audio_stream` tab of the Google Sheet.
**Columns Expected:**
- `category` (Format: `Rank - Unit Name - Section Name`)
- `title`
- `drive_file_id` (The ID part of a drive link)
- `order` (Optional, for sorting)

## Deployment (Firebase Hosting)

This app is configured for **Firebase Hosting** (Free Spark Plan).

### Initial Setup
1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```
2. **Login**:
   ```bash
   firebase login
   ```
   (Log in with `childrenministry@ccac.church`).

3. **Initialize**:
   ```bash
   firebase init hosting
   ```
   - Select "Use an existing project" (or create one).
   - Public directory: `out`
   - Configure as single-page app? **No** (We handle rewrites in `firebase.json` manually to avoid overwriting it).
   - Set up automatic builds? **No**.

### Deploying Updates
When you change code or need to redeploy:

1. **Build the App**:
   ```bash
   npm run build
   ```
   (This creates the static `out/` folder).

2. **Deploy**:
   ```bash
   firebase deploy
   ```

### Custom Domain
1. Go to Firebase Console > Hosting.
2. Click "Add Custom Domain".
3. Enter `sparks.ccac.church`.
4. Add the TXT records to your DNS provided by Firebase to verify ownership.
5. Update A records as instructed.

## Troubleshooting
- **No Audio**: Check if the Drive file has "General Access" set to "Anyone with the link".
- **Wrong Colors**: Ensure the 'category' column in the Sheet contains "HangGlider", "WingRunner", or "SkyStormer".
