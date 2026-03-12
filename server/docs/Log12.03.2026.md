# Development Log

## Date
2026-03-12

Today we continued working on the poll application and focused mostly on authentication, database setup and improving the frontend.

---

## Database

We connected our project to the PostgreSQL database hosted on **Render**.

To manage the database we used **DataGrip**.

We also created a `sessions` table to store login sessions.

```sql
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

This table is used to store active login sessions so the backend can verify users when they make requests.

Authentication

We improved the login and logout system.

Changes:

Sessions are now stored in the database.

Logout properly removes the session.

The frontend updates correctly when a user logs in or out.

We also fixed a bug where the previous username could still appear in the header after switching accounts.

Poll Improvements

We added a small improvement to the poll display.

Polls now show who created them.

Example:

Created by test11

We also made sure that:

only the creator of a poll can delete it

other users can still vote on the poll

Frontend Fixes

We improved how polls are loaded on the page.

Before:

the app sometimes tried to load polls even after the user logged out

this caused 401 Unauthorized errors

Now:

the app checks if the user has a valid session before loading polls

errors after logout are ignored

This makes the console cleaner and prevents unnecessary requests.

Service Worker

We updated the service worker to avoid caching API responses.

Previously this could cause:

outdated poll data

session issues

Now the service worker mainly caches static files like:

HTML

CSS

JavaScript

icons

Current Status

The application now supports:

account creation

login and logout

session authentication

poll creation

anonymous voting

poll deletion by the creator

showing the poll creator in the UI