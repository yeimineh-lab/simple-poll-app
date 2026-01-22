# Simple Poll App

## Project Description
Simple Poll App is a small full-stack application for creating polls, collecting votes, and viewing results.

The project is intentionally kept simple and focuses on **API design**, **incremental development**, and **clear project structure**, rather than building a complete production system.

This repository represents an early scaffold of the application, not a fully implemented solution.

---

## Purpose and Goal
The purpose of this project is to demonstrate:

- RESTful-ish API design
- Clear separation of client and server
- Incremental development using horizontal slices
- API documentation and testing
- Proper use of Git and project management tools

The goal is to show **how the system is designed and structured**, not to fully implement all features.

---

## Feature Map (Prioritized)

### Core Features (Implemented as API scaffold)
- Create a poll with a question and multiple options
- List available polls
- Vote on a poll
- View poll results

> All core features are currently implemented as **stub endpoints** without persistent storage.

### Planned Features (Not part of this assignment)
- User registration and authentication
- Poll ownership
- Persistent data storage (PostgreSQL)
- Prevent multiple votes per user

---

## Development Plan – Horizontal Slices

The project follows a **horizontal slice** approach, where each version results in a runnable application with limited functionality.

### v0.0.1 – API Scaffold (Current)
- Express server setup
- REST-like API structure
- Poll-related endpoints with stub responses
- OpenAPI documentation
- API testing setup using Bruno

Future versions are planned but not implemented as part of this assignment.

---

## API Documentation

The backend exposes a REST-like API for managing polls.

The API is documented using **OpenAPI 3.0**:


The OpenAPI specification describes:
- Available endpoints
- Request and response formats
- Example payloads
- HTTP status codes

The API is intentionally scaffolded and does not persist data.

---

## API Testing

API requests are tested using **Bruno**.

The Bruno collection is included in the repository:


The collection contains requests for:
- List polls
- Create poll
- Vote on poll
- Get poll results

A local environment is configured using a base URL variable.

---

## Project Structure

simple-poll-app/
├── client/
├── server/
│ ├── src/
│ │ ├── routes/
│ │ ├── controllers/
│ │ └── docs/
│ │ └── openapi.yaml
│ └── bruno/
├── README.md


- `client/` contains the frontend (not implemented)
- `server/` contains the backend API
- `docs/` contains OpenAPI documentation
- `bruno/` contains API test collections

---

## Project Management

GitHub Projects is used for project management.

A simple Kanban board is set up with the following columns:
- Todo
- In Progress
- Done

Tasks are grouped to reflect development steps and horizontal slices.

---

## Git Workflow

The project follows a structured Git workflow:
- Small, focused commits
- One logical change per commit
- Clear and descriptive commit messages

This demonstrates good Git practices and incremental development.

---

## Reflection

This project was developed as part of an assignment focusing on API design and project structure.

Key takeaways:
- Designing the API first clarified responsibilities between client and server
- OpenAPI made the API easier to reason about and communicate
- Using Bruno ensured the API could be tested independently of the client

The project is intentionally incomplete and serves as a foundation for further development.
