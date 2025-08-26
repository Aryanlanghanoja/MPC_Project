#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <Servo.h>

const char* ssid = "Galaxy Mayank";
const char* password = "123456789";

const char* serverUrl = "http://192.168.185.191:5000/node1";

WiFiClient client;
Servo servo1;
const int servoPin1 = D4;  // First servo

void setup() {
  Serial.begin(115200);
  delay(10);

  servo1.attach(servoPin1);

  servo1.write(0);  

  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected!");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(client, serverUrl);

    int httpCode = http.GET();

    if (httpCode > 0) {
      if (httpCode == HTTP_CODE_OK) {
        String payload = http.getString();

        StaticJsonDocument<300> doc;  // Bigger size since we have more keys
        DeserializationError error = deserializeJson(doc, payload);
        if (!error) {
          const char* status1 = doc["status"];

          Serial.print("Status1 from server: ");
          Serial.println(status1);

          // Control servo1
          if (strcmp(status1, "ON") == 0) {
            servo1.write(0);
            Serial.println("Servo1 moved to 180 degrees");
          } else if (strcmp(status1, "OFF") == 0) {
            servo1.write(180);
            Serial.println("Servo1 moved to 0 degrees");
          }

        } else {
          Serial.print("JSON parse error: ");
          Serial.println(error.c_str());
        }
      }
    } else {
      Serial.print("GET request failed, error: ");
      Serial.println(http.errorToString(httpCode).c_str());
    }

    http.end();
  } else {
    Serial.println("WiFi not connected");
  }

  delay(2000);  // Check every 2 seconds
}
