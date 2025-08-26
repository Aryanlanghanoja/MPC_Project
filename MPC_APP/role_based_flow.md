# 🔑 Role-Based Flow & Module Breakdown for Smart Door Lock Project

## 🎭 Roles in System
1. **Admin**
   - Manages system configuration (devices, schedules, users).
   - Full access to monitoring & logs.

2. **Faculty**
   - Limited control: can override door open/close **outside schedule**.
   - No ability to configure system or add devices.

3. **Device (NodeMCU)**
   - Executes commands (LOCK/UNLOCK).
   - Sends status updates (heartbeat).
   - Does not interact with UI directly.

---

## 📦 Core Modules & Their Purpose

### 1. **Authentication Module**
- **Entities**: User (Admin, Faculty)  
- **Actions**:  
  - Admin: Login, Register new faculty  
  - Faculty: Login  
- **Usage**: Provides JWT tokens for secure API calls.  

### 2. **Device Management Module**
- **Entities**: Device (id, device_id, name, location, status)  
- **Actions**:  
  - Admin: Register new device, view device status, assign schedule  
  - Faculty: View device state only  
  - Device: Register itself (with unique ID) & send heartbeat  
- **Usage**: Keeps track of physical doors and their current states.  

### 3. **Schedule Management Module**
- **Entities**: Schedule (device_id, day_of_week, open_time, close_time)  
- **Actions**:  
  - Admin: Add, update, delete schedules  
  - Faculty: View schedules only  
  - Device: Follows schedule enforced by backend  
- **Usage**: Defines when a door should open/close automatically.  

### 4. **Override Module**
- **Entities**: Override (device_id, user_id, action, expires_at)  
- **Actions**:  
  - Admin: Can override any device  
  - Faculty: Can override assigned devices (open/close temporarily)  
  - Device: Applies override when received from server  
- **Usage**: Allows temporary deviation from schedule.  

### 5. **Device Communication Module**
- **Entities**: DeviceCommand (device_id, command, expires_at, executed)  
- **Actions**:  
  - Device: Sends heartbeat (status)  
  - Backend: Responds with latest command (LOCK/UNLOCK)  
- **Usage**: Syncs backend decisions (schedule/override) with hardware.  

### 6. **Logging Module**
- **Entities**: Log (device_id, user_id, action, timestamp, status)  
- **Actions**:  
  - Admin: View all logs (audit trail)  
  - Faculty: View personal actions only  
  - Device: Auto-generates logs when action executed  
- **Usage**: Records every unlock/lock event.  

---

## 🔄 Role-Based Flow of Actions

### **Admin Flow**
1. Login → Get JWT  
2. Register Device → Assign device_id  
3. Configure Schedule (add/update/delete)  
4. Override door if needed (force open/close)  
5. View logs for all devices/users  
6. Monitor device health (via heartbeat)  

✅ Full control over system.  

### **Faculty Flow**
1. Login → Get JWT  
2. View assigned devices & schedules  
3. Override device state outside schedule (temporary unlock/lock)  
4. See log history of their own overrides  

✅ Can only control doors, not configure system.  

### **Device Flow**
1. Boot → Register with device_id  
2. Send heartbeat → “I’m LOCKED at 10:00 AM”  
3. Backend responds → “Command = UNLOCK (expires at 11:00 AM)”  
4. Device executes command → Unlocks servo  
5. Device confirms execution in next heartbeat  
6. Logs entry created automatically  

✅ Executes backend instructions, does not make decisions.  

---

## 📐 How Modules Are Used in Code Generation

1. **Authentication Module**  
   - Backend: JWT middleware, AuthController  
   - App: Retrofit AuthService, Login Screen, JWT storage in DataStore  

2. **Device Management Module**  
   - Backend: DeviceController, DeviceService  
   - App: DeviceRepository, DeviceList UI  
   - Device: `POST /heartbeat`, registration  

3. **Schedule Management Module**  
   - Backend: Cron job checks DB → inserts LOCK/UNLOCK commands  
   - App: Admin → Schedule UI, Faculty → read-only view  

4. **Override Module**  
   - Backend: OverrideController → inserts override + DeviceCommand  
   - App: Faculty → Override screen (Unlock Now)  
   - Device: Executes command when received  

5. **Device Communication Module**  
   - Backend: DeviceCommController → respond to heartbeat  
   - Device: Poll every minute or use MQTT for push  

6. **Logging Module**  
   - Backend: LogService → insert records  
   - App: Admin → Log Viewer, Faculty → Personal history  
