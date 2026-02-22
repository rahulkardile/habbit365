# Welcome Flow & Backend Setup Guide

## 1. First‑time / No‑account flow
- **Root layout ([_layout.tsx](file:///home/rahul-2/Documents/code/habbit365/client/app/_layout.tsx))** now checks AsyncStorage for a stored `user`.
- If a user exists → `router.replace("/(tabs)/home")`.
- If no user → `router.replace("/welcomeScreen")`.
- Added a **WelcomeScreen** component under [client/app/(auth)/welcomeScreen.tsx](file:///home/rahul-2/Documents/code/habbit365/client/app/%28auth%29/welcomeScreen.tsx) (or move to [(tabs)](file:///home/rahul-2/Documents/code/habbit365/client/app/%28tabs%29/_layout.tsx#5-74) as you prefer).

## 2. Authentication redirects
- After successful **login** or **registration**, call `router.replace("/home")`.
- Updated [client/app/(auth)/_layout.tsx](file:///home/rahul-2/Documents/code/habbit365/client/app/%28auth%29/_layout.tsx) to include a `welcomeScreen` route (header hidden).
- Removed the welcome tab from the tab bar (see diff in [(tabs)/_layout.tsx](file:///home/rahul-2/Documents/code/habbit365/client/app/%28tabs%29/_layout.tsx#5-74)).

## 3. Database schema (SQL)
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE habits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  frequency VARCHAR(20) CHECK (frequency IN ('daily','weekly','monthly')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE habit_logs (
  id SERIAL PRIMARY KEY,
  habit_id INTEGER REFERENCES habits(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  status VARCHAR(10) CHECK (status IN ('done','missed')) NOT NULL,
  note TEXT,
  UNIQUE (habit_id, log_date)
);
```

## 4. Backend API routes (Express‑style example)
- `POST /api/auth/register` – create user, hash password.
- `POST /api/auth/login` – return JWT.
- `GET /api/habits` – list user habits (auth required).
- `POST /api/habits` – create habit.
- `PUT /api/habits/:id` – update habit.
- `DELETE /api/habits/:id` – delete habit.
- `POST /api/habits/:id/logs` – create/update daily log.
- `GET /api/dashboard/summary` – aggregated stats for UI.

## 5. Front‑end integration
- Use a tiny API client that adds the JWT header.
- Fetch habits on the home screen with `useSWR` or `react‑query`.
- Submit log entries via `POST /api/habits/:id/logs`.
- Show a summary using `/api/dashboard/summary`.

## 6. Quick checklist
- [ ] Add `welcomeScreen.tsx` component.
- [ ] Update auth components to redirect to `/home`.
- [ ] Ensure `_layout.tsx` routing logic works.
- [ ] Run DB migrations for the three tables.
- [ ] Implement the API endpoints above.
- [ ] Wire UI to the new API.
- [ ] Test first‑time flow and logged‑in flow.

---
*All steps assume a standard Expo‑Router + React‑Native setup and a Node/Express backend with PostgreSQL. Adjust paths or frameworks as needed.*
