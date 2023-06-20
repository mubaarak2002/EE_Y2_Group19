#include <WiFi.h>
#include <string>
#include <WebSocketClient.h>

// wifi connection
const char* ssid = "AndroidAP";
const char* password = "mubs2002";
char path[] = "/";
// aws server public ip (port is always 5000)
char host[] = "3.91.176.252:5000";

// FPGA setup
const int bufferSize = 40;  // Size of the buffer to store the image, corresponds to message length from fpga
uint8_t imageBuffer[bufferSize];
int bytesRead = 0;  // Number of bytes read
int UART_offset = 0;
int shiftedData [20];
  
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
  if (client.connect("3.91.176.252", 5000)) {
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

void FPGA_vars(){
  if (Serial.available()) {
    // Read the incoming data and store it in the buffer
    bytesRead += Serial.readBytesUntil('\n', imageBuffer, bufferSize);
    
    
    // Check if the entire image has been received
    if (bytesRead >= bufferSize) {
      // Image received completely
      
      // Process the image data as needed
      // You can save it to an SD card, display it on a screen, or perform any other operation
      
      // Reset the bytesRead counter for the next image
      for (int i = 0; i < bufferSize; i++){
        //Serial.println(i);
//        Serial.print(imageBuffer[i]);
//        Serial.print(i);
//        Serial.print(" ");
        if (imageBuffer[i+1] == 66){
          if (imageBuffer[i+2] == 66){
            if (imageBuffer[i+3] == 82){
              UART_offset = i;
//              Serial.println();
//              Serial.println(UART_offset);
            }
          }
        }
        shiftedData[i-UART_offset] = imageBuffer[i+1];
//        Serial.print(shiftedData[i]);
//        Serial.print(" ");
      }
      Serial.print("stream in:");
      for(int i = 0; i < 40; i++){
        Serial.print(imageBuffer[i]);
        Serial.print(" ");
      }
      Serial.println();

      Serial.print("shifted::");
      for(int i = 0; i < 20; i++){
        Serial.print(shiftedData[i]);
        Serial.print(" ");
      }
      Serial.println();
      bytesRead = 0;
    }
  UART_offset = 0;
  }
}

void loop() {
  FPGA_vars();
  String data;
  String rcv;

  if (client.connected()) {
    
    webSocketClient.getData(rcv);
    if (rcv.length() > 0) {
      //Serial.print("Received data: ");
      //Serial.println(rcv);
    }

    int coordinates[ 9 ][ 2 ] = {
      { shiftedData[0] , shiftedData[1] },
      { shiftedData[2] , shiftedData[3] },
      { shiftedData[4] , shiftedData[5] },
      { shiftedData[6] , shiftedData[7] },
      { shiftedData[8] , shiftedData[9] },
      { shiftedData[10] , shiftedData[11] },
      { shiftedData[12] , shiftedData[13] },
      { shiftedData[14] , shiftedData[15] },
      { shiftedData[16] , shiftedData[17] },
    };

    int rovcoordinates[ 2 ] = { shiftedData[18], shiftedData[19] };

    data = ToServer(coordinates, rovcoordinates);
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