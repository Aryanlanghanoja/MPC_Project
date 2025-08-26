# Code Generation Guidelines for Smart Door Lock Android App (Kotlin)

## Tech Stack

-   Android (Kotlin)
-   Retrofit (API communication)
-   Room (Local DB cache)
-   ViewModel + LiveData (MVVM architecture)
-   Coroutines (async operations)
-   DataStore (for JWT & environment configs)
-   Firebase (optional: push notifications)

## Folder Structure

app/ ├── src/main/java/com/example/smartdoor/ │ ├── data/ │ │ ├── api/
\# Retrofit services │ │ ├── db/ \# Room database + entities │ │ ├──
model/ \# Data classes │ │ └── repository/ \# Data handling logic │ ├──
ui/ │ │ ├── auth/ \# Login/Register screens │ │ ├── devices/ \# Device
list, status │ │ ├── schedules/ \# Schedule management │ │ ├──
overrides/ \# Faculty overrides │ │ └── logs/ \# Admin log view │ ├──
viewmodel/ \# ViewModels for each screen │ ├── utils/ \# Helpers (JWT
handling, time utils) │ └── MainActivity.kt ├── res/ └──
AndroidManifest.xml

## Modules & Responsibilities

### Data Layer

-   **Retrofit API Service** → Define endpoints for /auth, /devices,
    /schedules, /overrides, /logs
-   **Room Entities** → Cache devices, schedules, logs
-   **Repository** → Single source of truth (merges API + Room)

### UI Layer

-   **Auth Screens** (Login/Register)
-   **Admin Screens** (Add device, configure schedule, view logs)
-   **Faculty Screens** (View device state, request override)
-   **Shared Screens** (Device list, profile, settings)

### ViewModels

-   Use LiveData/StateFlow to expose data to UI
-   Call repository methods for API + DB actions

### Utils

-   **JWT Manager** → Save/retrieve JWT in DataStore
-   **Env Manager** → Store API_BASE_URL and ENV in DataStore
    (dev/staging/prod)
-   **DateTime Utils** → Convert schedule times for display

## Environment Guidelines (env)

-   Use DataStore to persist environment variables locally.
-   Example DataStore keys:
    -   API_BASE_URL → "https://api.smartdoor.dev"
    -   ENV → "development" / "production"
    -   JWT_TOKEN → stored after login
-   Allow switching environment (dev/prod) in app Settings screen.

## Flow of Code Generation

1.  **Bootstrap Project**
    -   Create new Kotlin project with MVVM template
    -   Setup dependencies (Retrofit, Room, Coroutines, DataStore)
2.  **Setup Environment Config**
    -   DataStore for API_BASE_URL, ENV
    -   Provide default (development)
3.  **Define Models**
    -   User, Device, Schedule, Override, Command, Log
4.  **Setup Retrofit API**
    -   Define endpoints matching Node.js backend
    -   AuthInterceptor → attach JWT from DataStore
5.  **Setup Room DB**
    -   Entities for devices, schedules, logs
    -   DAO interfaces
6.  **Create Repositories**
    -   DevicesRepository, AuthRepository, ScheduleRepository,
        OverrideRepository, LogRepository
7.  **Implement ViewModels**
    -   One ViewModel per screen
    -   Use Coroutines for async API calls
8.  **UI Implementation**
    -   Auth → Login/Register
    -   Admin → Manage devices, schedules, logs
    -   Faculty → Device state, override
    -   Shared → Device list
9.  **Testing**
    -   Unit test repositories with mocked API/DB
    -   UI test flows with Espresso

## Example Override Flow (App)

1.  Faculty logs in → JWT stored in DataStore
2.  Faculty selects device → taps "Override Unlock"
3.  Retrofit call to POST /overrides
4.  Repository saves response to Room DB
5.  ViewModel updates LiveData → UI shows "Door Unlocked"

------------------------------------------------------------------------

These guidelines ensure modular, testable, and maintainable Kotlin
Android app code generation.
