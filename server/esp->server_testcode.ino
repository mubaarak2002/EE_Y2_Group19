#include <WiFi.h>
#include <string>
#include <WebSocketClient.h>

// wifi connection
const char* ssid = "";
const char* password = "";
char path[] = "/";
// aws server public ip (port is always 5000)
char host[] = "54.84.92.150:5000";
  
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
  if (client.connect("54.84.92.150", 5000)) {
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

// this function puts the coordinates in the correct format to send to the server
// 2 variables - 2D array of wall coordinates - 1D array of rover coordinates
String ToServer(int coordinates[ 9 ][ 2 ], int rovcoordinates[ 2 ]){
  String data;
  String rcv;
  for( int i = 0; i < 8; i++){
    data += coordinates[i][0];
    data += " ";
    data += coordinates[i][1];
    data += ",";
  }
    data += rovcoordinates[0];
    data += " ";
    data += rovcoordinates[1];
  //int lastIndex = data.length() - 1;
  //data.remove(lastIndex);
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

    int rovcoordinates[ 2 ] = { 100, 200 };

    Serial.print("in");
    data = ToServer(coordinates, rovcoordinates);
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