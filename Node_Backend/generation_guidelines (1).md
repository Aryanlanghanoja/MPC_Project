# Code Generation Guidelines for Smart Door Lock Backend

## Tech Stack

-   Node.js (Express.js)
-   PostgreSQL with Sequelize ORM
-   JWT Authentication
-   node-cron for scheduling
-   bcrypt, helmet, dotenv

## Folder Structure

backend/ ├── src/ │ ├── config/ \# DB + env config │ ├── models/ \#
Sequelize models │ ├── migrations/ \# DB migrations │ ├── routes/ \#
Express routes │ ├── controllers/ \# API logic │ ├── services/ \#
Business logic │ ├── middlewares/ \# Auth, error handling │ ├── utils/
\# Helpers │ └── index.js \# Entry point ├── package.json └── .env

## Modules & Responsibilities

### Config

-   Database connection (Sequelize)
-   Environment variables

### Models

-   User (id, name, role, email, passwordHash)
-   Device (id, device_id, name, location, status)
-   Schedule (id, device_id, day_of_week, open_time, close_time)
-   Override (id, device_id, user_id, action, expires_at)
-   DeviceCommand (id, device_id, command, expires_at, executed)
-   Log (id, device_id, user_id, action, timestamp, status)

### Routes

-   /auth → login/register
-   /devices → register/list devices, state
-   /schedules → add/update/delete schedules
-   /overrides → faculty overrides
-   /device-comm → device heartbeat
-   /logs → view logs (admin)

### Controllers

-   Implement API request handling, call services, return responses.

### Services

-   Encapsulate business logic (Auth, Device, Schedule, Override, Logs).

### Middlewares

-   JWT verification
-   Role-based access
-   Error handling

### Scheduler

-   Runs every minute
-   Checks schedules + overrides
-   Updates device_commands table

### Device Communication

-   Device heartbeat POSTs current status
-   Backend responds with latest command for that device_id

### Flow of Code Generation

1.  Bootstrap project (npm init, install dependencies)
2.  Setup config & Sequelize
3.  Define models + migrations
4.  Implement services
5.  Implement controllers
6.  Define routes
7.  Add middleware
8.  Setup scheduler
9.  Implement logging
10. Test endpoints

### Example Override Flow

1.  Faculty logs in, gets JWT
2.  POST /overrides with device_id + action
3.  Backend stores override, updates device_commands
4.  Device polls, executes command
5.  Logs entry created

------------------------------------------------------------------------

These guidelines ensure consistent modular Node.js backend code
generation.
