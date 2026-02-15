Simple Poll App – User Client

This project is a simple full-stack application with a Node.js backend and a structured client built using Web Components.

The goal of this assignment was to build a client in a structured way that interacts with an existing User API.

Project Structure
simple-poll-app/
│
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── storage/
│   │   ├── app.js
│   │   └── index.js
│   │
│   ├── public/
│   │   ├── index.html
│   │   ├── app.mjs
│   │   ├── app.css
│   │   ├── data/
│   │   │   ├── api.mjs
│   │   │   └── userStore.mjs
│   │   └── ui/
│   │       ├── user-create.mjs
│   │       ├── user-edit.mjs
│   │       └── user-delete.mjs
│   │
│   └── data/
│       ├── users.json
│       └── polls.json
│
└── README.md

Architecture Decisions

The client is structured with separation of concerns:

UI Layer

Custom Web Components:

<user-create>

<user-edit>

<user-delete>

Each component handles only DOM and user interaction.

Data Layer

api.mjs contains the single fetch() call used by the entire client.

All API requests go through:

request(path, options)


This ensures:

Only relative URLs are used

Only one fetch gateway exists

Centralized error handling

Logic Layer

userStore.mjs works as a small state manager using the observer pattern (EventTarget).

The UI listens to "change" events and re-renders automatically.

This avoids duplication of data structures and keeps the state in one place.

Requirements Checklist

✔ Only relative URLs used
✔ Only one fetch() in the client
✔ No duplicated data object structures
✔ Separation of UI, Logic, and Data
✔ Custom web components for:

Creating users

Editing users

Deleting users
✔ Client communicates with API successfully

How to Run

Install dependencies:

cd server
npm install


Start development server:

npm run dev


Server runs on:

http://localhost:3000


The client is served from the public folder.

Reflection

For this assignment I focused on creating a clear architecture early.
Using a small store with the observer pattern helped avoid tightly coupling UI to API calls.

Separating the fetch gateway from business logic made the application easier to reason about and extend.

This structure also makes future features easier to add without rewriting core parts of the system.