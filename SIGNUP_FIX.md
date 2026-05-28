# Signup Fix Report

## Summary
This fix addresses the frontend signup failure that produced the error:

> "Unexpected end of JSON input"

The root cause was that the frontend always attempted to parse the backend response as JSON, even when the backend returned an empty body, non-JSON error page, or crashed before sending a valid JSON response.

## What was changed

### Backend
- `backend/server.js`
  - Confirmed `express.json()` middleware is enabled.
  - Added request logging for each incoming request.
  - Added a 404 JSON handler to return `{ error: "Not found" }` for unknown routes.
  - Added a global error handler that returns JSON on uncaught errors.
  - Added process-level handlers for `unhandledRejection` and `uncaughtException`.

- `backend/controllers/authcontroller.js`
  - Added `try/catch` for both `registerUser` and `loginUser`.
  - Logged `req.body` for debugging.
  - Checked for missing `JWT_SECRET` before generating JWT tokens.
  - Standardized JSON response output with `return res.status(...).json(...)`.
  - Accepted both `fullName` and `full_name` from frontend requests.
  - Returned `full_name` consistently from the user record.

### Frontend
- `client/src/pages/SignupPage.tsx`
  - Added safe response parsing based on `Content-Type`.
  - Handled empty or invalid JSON responses.
  - Logged non-JSON responses for debugging.
  - Kept error handling robust and user-friendly.

- `client/src/config.ts`
  - Added a fallback default for `API` when `VITE_API_URL` is not set.

## Verified configurations
- `backend/.env` contains:
  - `MONGO_URI=mongodb://localhost:27017/resume-analyzer`
  - `JWT_SECRET=supriya_resume_project_2026_secret`
- `backend/server.js` loads `dotenv.config()` and attempts MongoDB connection.
- `backend/middleware/authmiddleware.js` uses `process.env.JWT_SECRET` to verify JWT.

## Exact bug explanation
The user error occurred because the frontend did this unconditionally:

```ts
const data = await response.json();
```

If the backend returned:
- an empty body,
- an HTML error page,
- a crash before sending JSON,
- or a response without `Content-Type: application/json`,

then `response.json()` throws `Unexpected end of JSON input`.

In this project, the bug was compounded by:
- frontend sending `full_name` while the backend controller was reading `fullName`,
- no global JSON error response when Express errors occurred,
- backend startup failures observed in terminal logs.

## How to reproduce
1. Start backend:
   ```bash
   cd backend
   npm install
   npm start
   ```
2. Start frontend:
   ```bash
   cd client
   npm install
   npm run dev
   ```
3. Submit the signup form.

## Files changed
- `backend/server.js`
- `backend/controllers/authcontroller.js`
- `client/src/pages/SignupPage.tsx`
- `client/src/config.ts`

## Notes
- The fix ensures the backend always returns JSON for API errors.
- The fix ensures frontend only parses JSON when safe.
- The fix adds debugging logs for request bodies and server errors.
