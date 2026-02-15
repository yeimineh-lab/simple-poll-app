# Simple Poll App

Simple Poll App is a full-stack web application built with Node.js and Express on the backend and a modular ES Module-based client using Custom Web Components.

The application demonstrates clean architecture, separation of concerns, and structured project organization.

---

## What the Application Does

The application provides:

- User registration
- User authentication (login & logout)
- Edit user profile
- Delete user account
- Token-based authentication
- Centralized API communication
- Structured client-side state management

The client communicates with the API using relative URLs only.

---

## How to Run the Application

### 1. Navigate to the server directory

```bash
cd server
2. Install dependencies
npm install
3. Start the development server
npm run dev
4. Open in browser
http://localhost:3000
The Express server serves both the API and the client from the same origin.

Project Structure
simple-poll-app/
└─ server/
   ├─ src/
   │  ├─ app.js              # Express configuration
   │  ├─ index.js            # Server entry point
   │  │
   │  ├─ routes/             # API route modules
   │  ├─ middleware/         # Custom middleware
   │  ├─ auth/               # Authentication logic
   │  └─ storage/            # JSON storage layer
   │
   ├─ public/                # Client application
   │  ├─ index.html
   │  ├─ app.css
   │  ├─ app.mjs
   │  │
   │  ├─ data/
   │  │  ├─ api.mjs          # Single fetch gateway
   │  │  └─ userStore.mjs    # Centralized state logic
   │  │
   │  └─ ui/
   │     ├─ user-create.mjs
   │     ├─ user-edit.mjs
   │     └─ user-delete.mjs
   │
   └─ data/
      ├─ users.json
      └─ polls.json
Client Architecture
The client is structured into three layers:

1. UI Layer
Located in public/ui/

Uses Custom Web Components

Each component has a single responsibility

No direct API calls inside UI components

2. Logic Layer
Located in public/data/userStore.mjs

Centralized state management

Implements the Observer pattern using EventTarget

UI reacts automatically to state changes

3. Data Layer
Located in public/data/api.mjs

Contains the only fetch() call in the client

Uses relative URLs only

Centralized error handling

This structure ensures clean separation between UI, logic, and data handling.

Backend Architecture
The backend follows a modular Express structure:

Routes are separated by domain (users, auth, polls)

Middleware is isolated

JSON file storage is abstracted into a storage layer

Error handling and 404 handling are centralized

The server serves both the API and the client from the same Express instance.

Repository
https://github.com/yeimineh-lab/simple-poll-app