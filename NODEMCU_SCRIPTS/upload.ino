
/*
  Smart Door Lock - NodeMCU (ESP8266) Firmware
  - Polls backend heartbeat endpoint
  - Receives "lock" / "unlock"
  - Drives a servo accordingly
  - Matches the Node backend API you’re running on port 3000

  Board: NodeMCU 1.0 (ESP-12E Module)
  Requires Libraries:
    - ESP8266WiFi
    - ESP8266HTTPClient
    - ArduinoJson (>= 6.x)
    - Servo
*/

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <Servo.h>

// ======== CONFIGURE THESE ========
const char* WIFI_SSID     = "Aryan_Langhanoja";
const char* WIFI_PASSWORD = "1234567890";

// Use your PC's LAN IP (not localhost) and port 3000
// Example: "http://192.168.1.50:3000/api/device-comm/heartbeat"
const char* HEARTBEAT_URL = "http://10.183.190.191:3000/api/device-comm/heartbeat";

// Must match exactly the device_id you registered via the admin app
const char* DEVICE_ID     = "LAB_113";

// Servo pin and angles for your lock
const int SERVO_PIN       = D4;
const int ANGLE_LOCKED    = 0;    // adjust if needed
const int ANGLE_UNLOCKED  = 180;  // adjust if needed

// Heartbeat interval (ms)
const unsigned long POLL_MS = 2000;

// ======== GLOBALS ========
WiFiClient wifi;
HTTPClient http;
Servo lockServo;
unsigned long lastPoll = 0;

void connectWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.print(WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    if (++attempts > 60) {
      Serial.println("\nWiFi connect timeout. Restarting...");
      ESP.restart();
    }
  }
  Serial.print("\nConnected. IP: ");
  Serial.println(WiFi.localIP());
}

void setup() {
  Serial.begin(115200);
  delay(100);

  lockServo.attach(SERVO_PIN);
  // Set default on boot
  lockServo.write(ANGLE_LOCKED);

  connectWiFi();
}

void sendHeartbeatAndAct() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
    return;
  }

  // Prepare JSON body
  StaticJsonDocument<128> req;
  req["device_id"] = DEVICE_ID;
  req["status"] = "online";
  String body;
  serializeJson(req, body);

  http.begin(wifi, HEARTBEAT_URL);
  http.addHeader("Content-Type", "application/json");

  int code = http.POST(body);
  if (code > 0) {
    if (code == HTTP_CODE_OK) {
      String payload = http.getString();
      StaticJsonDocument<512> doc;
      DeserializationError err = deserializeJson(doc, payload);
      if (!err) {
        // Expected payload:
        // { "message": "...", "data": { "command": "lock" | "unlock" | null, "expires_at": "..." } }
        const char* command = nullptr;
        if (doc["data"].is<JsonObject>()) {
          command = doc["data"]["command"] | (const char*)nullptr;
        }

        if (command) {
          Serial.print("Received command: ");
          Serial.println(command);

          if (strcmp(command, "lock") == 0) {
            lockServo.write(ANGLE_LOCKED);
            Serial.println("Servo -> LOCKED");
          } else if (strcmp(command, "unlock") == 0) {
            lockServo.write(ANGLE_UNLOCKED);
            Serial.println("Servo -> UNLOCKED");
          } else {
            Serial.println("Unknown command");
          }
        } else {
          // No pending command
          // Serial.println("No command");
        }
      } else {
        Serial.print("JSON parse error: ");
        Serial.println(err.c_str());
      }
    } else {
      Serial.print("HTTP error code: ");
      Serial.println(code);
    }
  } else {
    Serial.print("POST failed: ");
    Serial.println(http.errorToString(code).c_str());
  }

  http.end();
}

void loop() {
  unsigned long now = millis();
  if (now - lastPoll >= POLL_MS) {
    lastPoll = now;
    sendHeartbeatAndAct();
  }
}
