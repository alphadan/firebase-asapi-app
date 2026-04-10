# Alphabet Signs ASAPI Admin Console

A modernized admin interface for the ASAPI console, built with **React 18** and **Vite**, designed to manage vendors, reviews, blog posts, and shipping overrides via Firebase Firestore.

## 🚀 Key Improvements (Migration from CRA to Vite)

- **Speed**: Instant Hot Module Replacement (HMR) and significantly faster build times.
- **Modern UI**: Fully refactored using **Material UI (MUI)** with a professional dashboard layout.
- **Security**: Moved Firebase configurations to environment variables (`.env`).
- **User Experience**: 
  - **Live Search**: Global filtering across all fields in a collection.
  - **Skeleton Loading**: Visual placeholders for a smoother perceived performance.
  - **Snackbars**: Non-blocking notifications for CRUD actions.
  - **Responsive Layout**: Sidebar navigation with a sticky top-bar dashboard.

## 🛠️ Tech Stack

- **Framework**: [React 18](https://reactjs.org/) (Vite)
- **UI Library**: [Material UI (MUI)](https://mui.com/)
- **Backend**: [Firebase](https://firebase.google.com/) (Auth, Firestore, Cloud Functions)
- **Icons**: [MUI Icons](https://mui.com/material-ui/material-icons/)

## 🏁 Getting Started

### 1. Prerequisites
Ensure you have **Node.js 18+** installed.

### 2. Environment Setup
Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_DATABASE_URL=your_url
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

### 3. Install Dependencies

Since the project was migrated from Create React App to Vite, a clean installation is recommended to remove legacy dependencies:

**Windows (PowerShell):**
```powershell
# Remove old node_modules and lock files
Remove-Item -Recurse -Force node_modules, package-lock.json, yarn.lock

# Reinstall clean
npm install

## 📜 Available Scripts

In the project directory, you can run the following commands:

### `npm start` (or `npm run dev`)
Starts the Vite development server.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.  
The page will reload instantly (HMR) when you make changes to the source code.

### `npm run build`
Compiles the application for production.  
Vite will bundle the React project into the `/build` directory using Rollup. This build is minified, optimized, and ready for deployment to **Firebase Hosting**.

### `npm run preview`
Locally serves the production build from the `/build` folder.  
Use this to verify that the optimized production version of the app works correctly before deploying.

### `npm run lint`
Runs ESLint to check the code for potential errors and styling issues according to the project's configuration.

## 📂 Project Structure

The project has been refactored into a modular architecture for better maintainability and scalability:

### `/src`
- **`components/`**: 
    - **`layout/`**: Core UI components (`Sidebar.jsx`, `MainContent.jsx`).
    - **`auth/`**: Security components like `AuthGuard.jsx` and `LoginForm.jsx`.
    - **Add/Edit Forms**: Specific dialog forms for every collection (e.g., `AddEditVendorForm.jsx`).
- **`context/`**: Global State providers (e.g., `NotificationContext.jsx` for Snackbars).
- **`hooks/`**: Custom React hooks, including `useCollection.js` for Firestore pagination logic.
- **`utils/`**: Shared helpers like `constants.js` and the `theme.js` configuration.
- **`images/`**: Brand assets and logos.

### Root Directory
- **`index.html`**: The entry point for the Vite application.
- **`vite.config.js`**: Central configuration for the build tool and development server.
- **`.env`**: (Local only) Stores sensitive Firebase API keys and environment variables.
- **`functions/`**: Contains the Firebase Cloud Functions (Node.js) for backend API logic.
- **`firebase.json`**: Deployment and Emulator configuration for Firebase services.
