# MPC Android App - Smart Door Lock

## API Base URL (Android Emulator)

- Default base URL is set to `http://10.0.2.2:3000/api/` in `DataStoreManager`.
- `10.0.2.2` maps to your host machine from the Android emulator.
- If you run on a physical device, replace with your machine IP, e.g. `http://192.168.1.10:3000/api/`.

You can change the base URL at runtime via `DataStoreManager.setApiBaseUrl(...)` (e.g., from a Settings screen).

## Quick Start

1. Start backend locally on port 3000
2. Open this project in Android Studio
3. Run the app on Android Emulator

## Auth & Roles
- Register/Login obtains JWT which is stored in DataStore
- Faculty: view devices, send lock/unlock, create overrides
- Admin: add devices, manage schedules, view logs

## Code Pointers
- DataStore: `data/datastore/DataStoreManager.kt`
- Networking: `data/network/NetworkModule.kt`, `data/network/AuthInterceptor.kt`
- Models: `data/model/Models.kt`
- API: `data/api/ApiService.kt`
- Repos: `data/repository/*`
- ViewModels: `viewmodel/*`
