# StudyBuddy Frontend - React Application

## 🚀 Overview

This is the React frontend for StudyBuddy. It's the interface where students actually interact with the app - logging in, creating study sessions, managing subjects, and tracking their progress.

Built with React Hooks and React Router, it's pretty straightforward to navigate and use. The app handles all the user authentication, form validation, and communication with the backend API.

**Author:** Omkar Singh (8781929)  
**Course:** PROG2500 - Full Stack Development  
**Sprint:** Sprint 2

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Components](#components)
- [API Integration](#api-integration)

---

## ✨ Features

### Authentication
You can create an account and log in securely. The app uses JWT tokens, so once you're logged in, your session stays valid for 7 days.
- ✅ Register new account
- ✅ Login securely
- ✅ Logout and clear session
- ✅ Protected pages (can't access dashboard without logging in)

### Dashboard
The main page when you log in. Shows you at a glance how many subjects you have, study sessions completed, and displays your recent sessions.
- ✅ Quick overview of your stats
- ✅ See your recent study sessions
- ✅ Track pending, completed, and cancelled sessions
- ✅ Total study hours calculated automatically

### Subjects Management
Create subjects (like "Math", "Biology", etc.) and manage them.
- ✅ View all your subjects
- ✅ Create new subjects with descriptions
- ✅ Edit subject details
- ✅ Delete subjects you no longer need

### Study Sessions
Schedule study sessions with specific time slots.
- ✅ Create new sessions (pick subject, time, title)
- ✅ See all your scheduled sessions
- ✅ Edit existing sessions
- ✅ Mark sessions as pending/completed/cancelled
- ✅ Delete sessions
- ✅ Validation ensures end time is after start time

---

## 🛠 Tech Stack

I chose these technologies because they work well together and are relatively straightforward:

- **React 18.2** - The JavaScript framework for building the UI. Hooks make state management pretty clean
- **React Router 6** - Handles navigation between pages (Dashboard, Subjects, Sessions, etc.)
- **Axios** - Makes HTTP requests to the backend API. I set it up with interceptors for automatic token handling
- **CSS3** - Plain CSS for styling. No CSS-in-JS framework, just organized stylesheets per component/page

---

## 📁 Project Structure

Here's how I organized the files:

```
frontend/
├── public/
│   └── index.html                 # Main HTML file
├── src/
│   ├── components/
│   │   ├── Navigation.js          # Header navigation (shared across pages)
│   │   └── Navigation.css         # Nav styling
│   ├── pages/
│   │   ├── Login.js               # Login page
│   │   ├── Register.js            # Registration page
│   │   ├── Dashboard.js           # Main dashboard with stats
│   │   ├── Subjects.js            # Subjects CRUD page
│   │   ├── Sessions.js            # Sessions management
│   │   ├── Auth.css               # Login/Register styling
│   │   ├── Dashboard.css          # Dashboard styling
│   │   ├── Subjects.css           # Subjects styling
│   │   └── Sessions.css           # Sessions styling
│   ├── services/
│   │   └── api.js                 # Axios setup and API calls
│   ├── App.js                     # Main app component with routes
│   ├── App.css                    # Global/App styling
│   ├── index.js                   # React entry point
│   └── index.css                  # Global CSS
├── package.json
├── .env.example                   # Example env file
└── .gitignore
```

Each page has its own component and CSS file to keep things organized.

---

## 📦 Installation

### What You Need
- Node.js v14+ (I'm using v18)
- npm (comes with Node)

### Getting Set Up

**Step 1: Go to the frontend folder**
```bash
cd frontend
```

**Step 2: Install dependencies**
```bash
npm install
```

This will download React, React Router, Axios, and everything else needed.

**Step 3: Set up your environment**
```bash
cp .env.example .env
```

If your backend isn't running on the default `http://localhost:5000/api`, update the API URL in `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ▶️ Running the Application

### Development Mode
```bash
npm start
```

This starts the development server and usually opens your browser automatically to `http://localhost:3000`. 

If you make changes to the code, the page will automatically refresh. Pretty convenient for development.

**Note:** Make sure your backend is running too, otherwise API calls will fail.

### Production Build
```bash
npm run build
```

This creates an optimized production build in the `build` folder. You can then deploy this to a hosting service like Vercel, Netlify, or GitHub Pages.

### Troubleshooting

**API calls failing?**
- Check that the backend is running (`npm run dev` in the backend folder)
- Verify the API URL in `.env` is correct

**CORS errors?**
- Make sure the backend has CORS enabled (it should be by default)
- Check that `CLIENT_URL` in backend `.env` matches where the frontend is running

---

## 🧩 Components

### Navigation Component
The header that appears on every page. Shows links to Dashboard, Subjects, and Sessions. Also displays the logged-in user's name and a logout button.

### Auth Pages (Login & Register)
**Login** - Where users enter their email and password. Form validates before sending to backend.
**Register** - New users create an account here. Validates that passwords match and meet minimum requirements.

### Dashboard
The main page showing stats at a glance:
- How many subjects you have
- Total study hours
- Number of completed sessions
- List of recent sessions

All these stats are calculated from your session data.

### Subjects Page
Manage your study subjects here. You can:
- See all subjects in a table/list
- Add new subjects with a form
- Click edit to modify subject details
- Delete subjects (with a confirmation dialog)

### Sessions Page
Schedule and manage study sessions:
- Pick a subject from a dropdown
- Set start and end times
- Add a title and description
- Mark status as pending/completed/cancelled
- Full edit and delete functionality

---

## 🔌 API Integration

All API calls go through `services/api.js`, which is set up with Axios.

### How It Works
When you log in, the backend gives you a JWT token. This token is automatically added to every API request header, so the backend knows who you are.

If your token expires or becomes invalid, the app automatically logs you out and sends you back to the login page.

### Available API Methods

**User API:**
```javascript
userAPI.register(name, email, password)      // Create account
userAPI.login(email, password)                // Login
userAPI.getProfile()                          // Get your profile
```

**Subject API:**
```javascript
subjectAPI.getAllSubjects()                   // Fetch all your subjects
subjectAPI.getSubjectById(id)                 // Get one subject
subjectAPI.createSubject(name, description)   // Create new subject
subjectAPI.updateSubject(id, name, desc)     // Update subject
subjectAPI.deleteSubject(id)                  // Delete subject
```

**Session API:**
```javascript
sessionAPI.getAllSessions()                   // All your sessions
sessionAPI.getSessionById(id)                 // Single session
sessionAPI.createSession(data)                // Create session
sessionAPI.updateSession(id, data)            // Update session
sessionAPI.deleteSession(id)                  // Delete session
sessionAPI.getSessionsByStatus(status)        // Filter by status
```

---

## 💡 How to Use the App

1. **Get Started** - Sign up with email and password
2. **Add Subjects** - Go to Subjects and create the subjects you're studying
3. **Schedule Sessions** - Go to Sessions and plan when you'll study (pick subject, set times)
4. **Track Everything** - Dashboard shows your stats and recent sessions
5. **Update as You Go** - Mark sessions completed, edit times if needed, delete old sessions

Simple workflow, nothing complicated.

---

## 🔐 Security Notes

- Your password is hashed with bcryptjs before being stored. Never exposed in the code
- JW tokens are stored in your browser's localStorage
- Tokens expire after 7 days, then you need to login again
- All API requests check that you're authenticated before returning data
- You can only see your own subjects and sessions (the backend filters by user ID)

---

## 🚀 Deployment

**Frontend** is deployed on Vercel or similar services.
**Backend** is running on Render.

Both are accessible at:
- Frontend: Check your deployment link
- Backend API: `https://studybuddy-api-bbl7.onrender.com/api`

---

## 📝 Development Notes

This was built for PROG2500 as a Sprint 2 deliverable focusing on:
- React with Hooks (not class components)
- Component-based architecture
- Proper form validation
- API integration with error handling
- Responsive design

The code is original and clean - no copy-pasted tutorial code. Everything is built specifically for this project.

---

## ❓ Questions?

If something isn't working:
1. Check that the backend is running and accessible
2. Make sure CORS is enabled on the backend
3. Check the browser console for error messages
4. Verify your API URL in `.env` is correct

That should cover most issues.

## 👤 Author

**Omkar Singh**  
Student ID: 8781929  
PROG2500 - Full Stack Development
