#include <WiFi.h>
#include <string>
#include <WebSocketClient.h>

// wifi connection
const char* ssid = "AndroidAP";
const char* password = "mubs2002";
char path[] = "/";
// aws server public ip (port is always 5000)
char host[] = "3.82.215.163:5000";
  
WebSocketClient webSocketClient;

// Use WiFiClient class to create TCP connections
WiFiClient client;

void setup() {
  Serial.begin(115200);
  delay(10);

  // We start by connecting to a WiFi network

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  delay(5000);
  

  // Connect to the websocket server
  if (client.connect("3.82.215.163", 5000)) {
    Serial.println("Connected");
  } else {
    Serial.println("Connection failed.");
    while(1) {
      // Hang on failure
    }
  }

  // Handshake with the server
  webSocketClient.path = path;
  webSocketClient.host = host;
  if (webSocketClient.handshake(client)) {
    Serial.println("Handshake successful");
  } else {
    Serial.println("Handshake failed.");
    while(1) {
      // Hang on failure
    }  
  }

}
//this function creates a string from a 2d array, in the correct format to be able to send to the server
String ToServer(int coordinates[ 9 ][ 2 ]){
  String data;
  String rcv;
  for( int i = 0; i < 8; i++){
    data += coordinates[i][0];
    data += " ";
    data += coordinates[i][1];
    data += ",";
  }
  int lastIndex = data.length() - 1;
  data.remove(lastIndex);
  return data;
  
}

void loop() {
  String data;
  String rcv;

  if (client.connected()) {
    
    webSocketClient.getData(rcv);
    if (data.length() > 0) {
      Serial.print("Received data: ");
      Serial.println(rcv);
    }

    int coordinates[ 9 ][ 2 ] = {
      { 1, 1 },
      { 2, 1 },
      { 3, 1 },
      { 4, 1 },
      { 5, 1 },
      { 6, 1 },
      { 7, 1 },
      { 8, 1 },
      { 9, 1 },
    };

    Serial.print("in");
    data = ToServer(coordinates);
    Serial.print("\n");
    Serial.print("out");
    Serial.print("\n");
    webSocketClient.sendData(data);

  } else {
    Serial.println("Client disconnected.");
    while (1) {
      // Hang on disconnect.
    }
  }
  delay (100);
  // wait to fully let the client disconnect
  
}