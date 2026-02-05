# Simple Poll App

## Overview
Simple Poll App is a small full-stack application for creating polls, collecting votes, and viewing results.

The project is intentionally minimal and focuses on **API design**, **separation of concerns**, **incremental development**, and **responsible user data handling**, rather than building a feature-complete production system.

The repository represents an early but functional stage of a system designed for clarity, correctness, and extensibility.

---

## Purpose
The primary goal of this project is to demonstrate:

- REST-style API design
- Clear separation between client, API, authentication, and storage
- Incremental development using horizontal slices
- Explicit user consent handling
- Data minimization and privacy-aware design
- API documentation and testing
- Clean project structure and version control practices

The emphasis is on **how the system is designed and reasoned about**, not on delivering a commercial product.

---

## Features

### Polls
- Create polls with a question and multiple options
- List available polls
- Vote on a poll
- View poll results

Poll data is persisted using JSON storage to keep the system simple and transparent.

---

## User Accounts

### Data Minimization
The application stores only the data required to support user accounts:

- `id` (UUID)
- `username` (public handle)
- `passwordHash` (bcrypt hash, never stored in plain text)
- `createdAt`
- Consent records:
  - Terms of Service (`acceptedAt`, `version`)
  - Privacy Policy (`acceptedAt`, `version`)

The application intentionally does **not** collect:
- Real names
- Email addresses
- Location data
- Analytics or tracking identifiers

---

### Account Endpoints

- **POST `/api/v1/users`**  
  Creates a user account. Requires explicit consent to Terms of Service and Privacy Policy.

- **POST `/api/v1/auth/login`**  
  Authenticates a user and returns a bearer token.

- **GET `/api/v1/auth/me`**  
  Returns the currently authenticated user.

- **DELETE `/api/v1/users/me`**  
  Deletes the user’s personal data and withdraws consent.

---

### Personal Data and Public Contributions
When a user deletes their account:

- All **personal account data** is removed from storage
- **Public contributions** (polls) remain available
- Poll ownership is anonymized:
  - `ownerId` is set to `null`
  - `ownerUsername` is replaced with `"deleted-user"`

This preserves application integrity while respecting user privacy.

---

## Consent Handling
- Users must actively accept the Terms of Service and Privacy Policy to create an account
- Consent timestamps and document versions are stored
- Users may withdraw consent at any time by deleting their account
- Account deletion immediately invalidates authentication tokens

---

## Architecture
The application follows a clear separation of concerns:

- **Routes** define HTTP endpoints
- **Authentication middleware** handles authorization and identity
- **Storage layer** abstracts persistence using JSON files
- **Client** is a minimal HTML interface consuming the API

Authentication is token-based and intentionally simple to support learning and clarity.

---

## Development Approach
The project was developed using a **horizontal slice** approach, where each step results in a runnable system.

Initial poll endpoints were implemented as stubs and later extended with persistence and user ownership as part of the user account assignment.

This approach allows functionality, architecture, and data concerns to evolve together.

---

## API Documentation
The backend API is documented using **OpenAPI 3.0**.

- 📄 OpenAPI specification: [`server/docs/openapi.yaml`](server/docs/openapi.yaml)

The specification can be viewed locally using tools such as Swagger UI or Redoc.

---

## API Testing
API requests are tested using **Bruno**.

The Bruno collection includes requests for:
- Poll operations
- User creation
- Authentication
- Account deletion

---

## Project Structure

simple-poll-app/
├── client/
│ └── index.html
├── server/
│ ├── src/
│ │ ├── routes/
│ │ ├── auth/
│ │ └── storage/
│ ├── docs/
│ │ └── openapi.yaml
│ ├── data/
│ └── bruno/
├── TERMS.md
├── PRIVACY.md
└── README.md


---

## How to Run

### Server
```bash
cd server
npm install
npm run dev
Client
Open in a browser:

http://localhost:3000/index.html

Legal Documents
Terms of Service: http://localhost:3000/TERMS.md

Privacy Policy: http://localhost:3000/PRIVACY.MD

Reflection
This project was developed as part of an assignment focused on user handling, privacy, and API architecture.

Key takeaways:

Explicit consent handling directly influences API and client design

Separating personal data from public contributions simplifies deletion flows

Designing account deletion early prevents architectural issues later

Even simple authentication schemes require careful reasoning

The project provides a clean and understandable foundation for future expansion while remaining intentionally minimal.