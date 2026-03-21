# StudyBuddy Frontend - React Application

## 🚀 Overview

StudyBuddy Frontend is a modern React application that provides an intuitive interface for managing study sessions, subjects, and tracking your academic progress.

**Author:** Omkar Singh (8781929)  
**Course:** PROG2500 - Full Stack Development  
**Sprint:** Sprint 2 (Frontend Development)

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
- ✅ User Registration - Create new account
- ✅ User Login - Secure login with JWT
- ✅ Logout - Clear session and tokens
- ✅ Protected Routes - Authentication checks

### Dashboard
- ✅ Overview Statistics - View subjects, sessions, completed sessions
- ✅ Recent Sessions - Display latest study sessions
- ✅ Session Status - Track pending, completed, cancelled sessions

### Subjects Management
- ✅ View All Subjects - List all user subjects
- ✅ Create Subject - Add new subjects with description
- ✅ Edit Subject - Update subject details
- ✅ Delete Subject - Remove subjects

### Study Sessions
- ✅ Schedule Sessions - Create study sessions with time slots
- ✅ View Sessions - Display all scheduled sessions
- ✅ Session Details - View subject, title, times, status
- ✅ Edit Sessions - Modify existing sessions
- ✅ Update Status - Mark as pending/completed/cancelled
- ✅ Delete Sessions - Remove sessions

---

## 🛠 Tech Stack

- **Frontend Framework:** React 18.2.0
- **Routing:** React Router DOM 6.21.0
- **HTTP Client:** Axios 1.6.2
- **Build Tool:** React Scripts 5.0.1
- **Styling:** CSS3 (Custom Styling)

---

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navigation.js
│   │   └── Navigation.css
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── Subjects.js
│   │   ├── Sessions.js
│   │   ├── Auth.css
│   │   ├── Dashboard.css
│   │   ├── Subjects.css
│   │   └── Sessions.css
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── .env.example
└── .gitignore
```

---

## 📦 Installation

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn

### Steps

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```
   
   Update `REACT_APP_API_URL` if your backend runs on a different URL.

---

## ▶️ Running the Application

### Development Mode
```bash
npm start
```
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
```
Builds the app for production to the `build` folder.

---

## 🧩 Components

### Navigation Component
- Sticky navigation bar with links
- User profile display
- Logout button

### Login Page
- Email and password inputs
- Form validation
- Error message display
- Link to registration

### Register Page
- Name, email, password inputs
- Password confirmation
- Error handling
- Link to login

### Dashboard Page
- Statistics cards (subjects, sessions, completed, pending)
- Recent sessions list
- Session status badges
- Quick overview of user's data

### Subjects Page
- Display all subjects
- Create new subject form
- Edit subject functionality
- Delete subject with confirmation
- Description display

### Sessions Page
- Schedule study sessions
- Subject selection dropdown
- Date/time picker for start and end times
- Session status dropdown
- Edit and delete functionality
- Session details display

---

## 🔌 API Integration

The frontend communicates with the backend API through the `services/api.js` file.

### API Service Methods

**User API:**
- `register(name, email, password)` - Create new account
- `login(email, password)` - Login user
- `getProfile()` - Get current user profile

**Subject API:**
- `getAllSubjects()` - Fetch all subjects
- `getSubjectById(id)` - Get single subject
- `createSubject(name, description)` - Create subject
- `updateSubject(id, name, description)` - Update subject
- `deleteSubject(id)` - Delete subject

**Session API:**
- `getAllSessions()` - Fetch all sessions
- `getSessionById(id)` - Get single session
- `createSession(sessionData)` - Create session
- `updateSession(id, sessionData)` - Update session
- `deleteSession(id)` - Delete session
- `getSessionsByStatus(status)` - Filter by status

### Authentication
JWT tokens are automatically included in all API requests via interceptors.

---

## 💡 Key Features Explained

### State Management
- Uses React hooks (`useState`, `useEffect`) for state management
- Local storage for JWT token and user data
- Context-free architecture for simplicity

### Form Handling
- Controlled components for form inputs
- Real-time validation
- Error message display
- Loading states during API calls

### Responsive Design
- Mobile-first approach
- CSS Grid and Flexbox layouts
- Media queries for different screen sizes

### Error Handling
- Try-catch blocks around API calls
- User-friendly error messages
- Network error handling

---

## 📱 Usage

1. **Register** - Create a new account with email and password
2. **Login** - Enter credentials to access dashboard
3. **Create Subject** - Add your study subjects
4. **Schedule Sessions** - Plan your study sessions with dates/times
5. **Track Progress** - Monitor completed and pending sessions
6. **Manage Sessions** - Edit or delete sessions as needed

---

## 🔐 Security

- JWT tokens stored in localStorage
- Protected routes require authentication
- Password validation on registration
- Secure API communication with token headers

---

## 📝 Notes

- This is a Sprint 2 delivery (Frontend Development)
- Backend API integration is fully functional
- Application is production-ready
- Responsive design works on all devices

---

## 👤 Author

**Omkar Singh**  
Student ID: 8781929  
PROG2500 - Full Stack Development
