Simple Poll App

A simple REST-based poll application built with Node.js and Express using ESM modules.

Users can:

Create an account

Log in and log out

Create polls

List polls

Delete their own account

Tech Stack

Node.js (ESM only)

Express

JSON file storage (via custom jsonStore)

REST-style API

OpenAPI specification

Project Structure
server/
├─ src/
│  ├─ app.mjs              # Express configuration
│  ├─ server.mjs           # Server entry point
│  ├─ routes/              # Route handlers (no business logic)
│  ├─ services/            # Business logic
│  ├─ storage/             # JSON storage layer
│  ├─ auth/                # Session handling
│  ├─ middleware/          # errorHandler, notFound, requireJson
│  ├─ domain/              # AppError subclasses
│  └─ config/              # Path configuration
├─ data/                   # JSON data files
├─ public/                 # Frontend files
└─ docs/
   └─ openapi.yaml         # API specification

How to Run Locally
cd server
npm install
npm start

Server runs at:

http://localhost:3000

Health check:

http://localhost:3000/health

API base:

http://localhost:3000/api/v1
API Documentation

The API is documented using OpenAPI 3.

OpenAPI file:

server/docs/openapi.yaml

Architecture

ESM-only backend (no CommonJS)

Clear separation of concerns:

Routes: HTTP layer only

Services: business logic

Storage: persistence layer

Centralized error handling using custom AppError subclasses

JSON-based persistence via custom storage abstraction