/*
 * Based upon code written by Yue Zhu (yue.zhu18@imperial.ac.uk) in July 2020.
 * pin6 is PWM output at 62.5kHz.
 * duty-cycle saturation is set as 2% - 98%
 * Control frequency is set as 1kHz. 
*/

#include <Wire.h>
#include <Adafruit_INA219.h>


Adafruit_INA219 ina219; // this is the instantiation of the library for the current sensor
int tick;
float open_loop, closed_loop; // Duty Cycles
float va,vb,vref,iL,dutyref,current_mA; // Measurement Variables
unsigned int sensorValue0,sensorValue1,sensorValue2,sensorValue3;  // ADC sample values declaration
float ev=0,cv=0,ei=0,oc=0; //internal signals
float Ts=0.001; //1 kHz control frequency. It's better to design the control period as integral multiple of switching period.
float kpv=0.05024,kiv=15.78,kdv=0; // voltage pid.
float u0v,u1v,delta_uv,e0v,e1v,e2v; // u->output; e->error; 0->this time; 1->last time; 2->last last time
float kpi=0.02512,kii=39.4,kdi=0; // float kpi=0.02512,kii=39.4,kdi=0; // current pid.
float u0i,u1i,delta_ui,e0i,e1i,e2i; // Internal values for the current controller
float uv_max=4, uv_min=0; //anti-windup limitation
float ui_max=50, ui_min=0; //anti-windup limitation
float current_limit = 1.0;
float last_power_val;
float current_power_val;

  //added for MPP
int arrCount;
float lastGenerated[2][10]; //[ [10 last power values], [10 last delta values]
float pow_last5av[5];    //10th to 6th most recent power readings average
float pow_recent5av[5];  //most recent 5 power readings average
float delta_last5av[5];    //10th to 6th most recent power readings average
float delta_recent5av[5];  //most recent 5 power readings average
const int n = 5;    //scalable if want to log more than the last 10 values
const int nend = 2 * n - 1;
const float increment = 0.005;
int count = 0;
    




boolean Boost_mode = 0;
boolean CL_mode = 0;
unsigned int loopTrigger;
unsigned int com_count=0;   // a variables to count the interrupts. Used for program debugging.

void setup() {

  //Basic pin setups
  
  noInterrupts(); //disable all interrupts
  pinMode(13, OUTPUT);  //Pin13 is used to time the loops of the controller
  pinMode(3, INPUT_PULLUP); //Pin3 is the input from the Buck/Boost switch
  pinMode(2, INPUT_PULLUP); // Pin 2 is the input from the CL/OL switch
  analogReference(EXTERNAL); // We are using an external analogue reference for the ADC

  // TimerA0 initialization for control-loop interrupt.
  
  TCA0.SINGLE.PER = 999; //
  TCA0.SINGLE.CMP1 = 999; //
  TCA0.SINGLE.CTRLA = TCA_SINGLE_CLKSEL_DIV16_gc | TCA_SINGLE_ENABLE_bm; //16 prescaler, 1M.
  TCA0.SINGLE.INTCTRL = TCA_SINGLE_CMP1_bm; 

  // TimerB0 initialization for PWM output
  
  pinMode(6, OUTPUT);
  TCB0.CTRLA=TCB_CLKSEL_CLKDIV1_gc | TCB_ENABLE_bm; //62.5kHz
  analogWrite(6,120); 

  Serial.begin(115200);   //serial communication enable. Used for program debugging.
  interrupts();  //enable interrupts.
  Wire.begin(); // We need this for the i2c comms for the current sensor
  ina219.init(); // this initiates the current sensor
  Wire.setClock(700000); // set the comms speed for i2c


  //for MPP
  arrCount = 0;
  lastGenerated = [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]];
}

 void loop() {
  if(loopTrigger) { // This loop is triggered, it wont run unless there is an interrupt
    
    digitalWrite(13, HIGH);   // set pin 13. Pin13 shows the time consumed by each control cycle. It's used for debugging.
    
    // Sample all of the measurements and check which control mode we are in
    sampling();
    CL_mode = digitalRead(3); // input from the OL_CL switch
    Boost_mode = digitalRead(2); // input from the Buck_Boost switch


//    int arrCount;
//    float[2][10] lastGenerated; //[ [10 last power values], [10 last delta values]
//    float pow_last5av;    //10th to 6th most recent power readings average
//    float pow_recent5av;  //most recent 5 power readings average
//    float delta_last5av;    //10th to 6th most recent power readings average
//    float delta_recent5av;  //most recent 5 power readings average

    float[5][2] last5av; 
    float[5][2] recent5av;

    arrCount += 1;
    int pos = arrCount%(2 * n)

    
    lastGenerated[pos][0] = current_mA * vb;
    lastGenerated[pos][1] = dutyRef;
    
    
    if [pos > n]{       // format the arrays of last measured power and duty
      for (int i = 0; i <= n-1; i++) {
        if (i + pos > nend){
          recent5av[i][0] = lastGenerated[i][0];
          recent5av[i][1] = lastGenerated[i][1];
        }else{
          recent5av[i][0] = lastGenerated[i+n][0];
          recent5av[i][1] = lastGenerated[i+n][1];
        }
        last5av[i][0] = lastGenerated[pos - n+ i][0];
        last5av[i][1] = lastGenerated[pos - n+ i][1];
      }
      
    }else{  // pos < 5
      for (int i = 0; i <= n-1; i++) {
          recent5av[i][0] = lastGenerated[i+pos][0];
          recent5av[i][1] = lastGenerated[i+pos][1];
          
        if (i + pos > 9){
          last5av[i][0] = lastGenerated[i+ pos - 2*n][0];
          last5av[i][1] = lastGenerated[i + pos - 2*n][1];
        }else{
          recent5av[i][0] = lastGenerated[pos + i+n][0];
          recent5av[i][1] = lastGenerated[pos + i+n][1];
        }
      }
    } //Two arrays updated

    //now calculate power averages and delta averages
    for (int i = 0; i <= n-1; i++) {
      pow_last5av     += last5av[i][0];
      pow_recent5av   += recent5av[i][0];
      delta_last5av   += last5av[i][1];
      delta_recent5av += recent5av[i][1];
    }
    pow_last5av     = pow_last5av/5;
    pow_recent5av   = pow_recent5av/5;
    delta_last5av   = delta_last5av/5;
    delta_recent5av = delta_recent5av/5;

    //Now adjust duty - increment constant defined at start

    if( pow_last5av  > pow_recent5av ){
      if (delta_last5av > delta_recent5av){
        delta += increment;
      }else{
        delta -= increment;
    }else{
      if (delta_last5av > delta_recent5av){
        delta -= increment;
      }else{
        delta += increment;
      }
    }

    //every 500 counts, reset everything
    if (count % 500 == 0){
      open_loop = 0.5;
      lastGenerated = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];
        //clear all values
    }else{
      open_loop = delta;
    }

    
    
    com_count++;              //used for debugging.
    if (com_count >= 1000) {  //send out data every second.
      Serial.print("Va: ");
      Serial.print(va);
      Serial.print("\t");
      
      Serial.print(last_power_val);
      Serial.print("mW\t");
      Serial.print(open_loop);
      Serial.print("\t");


      Serial.print(current_power_val);
      Serial.print("mW\t");


      Serial.print("Vb: ");
      Serial.print(vb);
      Serial.print("\t");

      Serial.print("Inductor Current: ");
      Serial.print(current_mA);
      Serial.print("\t\t");

      Serial.print("Boost Mode: ");
      Serial.print(Boost_mode);
      Serial.print("\t\t");

      Serial.print("CL Mode: ");
      Serial.print(CL_mode);
      Serial.print("\n");
      com_count = 0;
    }

    digitalWrite(13, LOW);   // reset pin13.
    loopTrigger = 0;
  }
}


// Timer A CMP1 interrupt. Every 800us the program enters this interrupt. 
// This, clears the incoming interrupt flag and triggers the main loop.

ISR(TCA0_CMP1_vect){
  TCA0.SINGLE.INTFLAGS |= TCA_SINGLE_CMP1_bm; //clear interrupt flag
  loopTrigger = 1;
}

// This subroutine processes all of the analogue samples, creating the required values for the main loop

void sampling(){

  // Make the initial sampling operations for the circuit measurements
  
  sensorValue0 = analogRead(A0); //sample Vb
  sensorValue2 = analogRead(A2); //sample Vref
  sensorValue3 = analogRead(A3); //sample Va
  current_mA = ina219.getCurrent_mA(); // sample the inductor current (via the sensor chip)

  // Process the values so they are a bit more usable/readable
  // The analogRead process gives a value between 0 and 1023 
  // representing a voltage between 0 and the analogue reference which is 4.096V
  
  vb = sensorValue0 * (12400/2400) * (4.096 / 1023.0); // Convert the Vb sensor reading to volts
  vref = sensorValue2 * (4.096 / 1023.0); // Convert the Vref sensor reading to volts
  va = sensorValue3 * (12400/2400) * (4.096 / 1023.0); // Convert the Va sensor reading to volts

  // The inductor current is in mA from the sensor so we need to convert to amps.
  // We want to treat it as an input current in the Boost, so its also inverted
  // For open loop control the duty cycle reference is calculated from the sensor
  // differently from the Vref, this time scaled between zero and 1.
  // The boost duty cycle needs to be saturated with a 0.33 minimum to prevent high output voltages
  
  if (Boost_mode == 1){
    iL = -current_mA/1000.0;
    dutyref = saturation(sensorValue2 * (1.0 / 1023.0),0.99,0.33);
  }else{
    iL = current_mA/1000.0;
    dutyref = sensorValue2 * (1.0 / 1023.0);
  }
  
}

float saturation( float sat_input, float uplim, float lowlim){ // Saturatio function
  if (sat_input > uplim) sat_input=uplim;
  else if (sat_input < lowlim ) sat_input=lowlim;
  else;
  return sat_input;
}

void pwm_modulate(float pwm_input){ // PWM function
  analogWrite(6,(int)(255-pwm_input*255)); 
}


/*end of the program.*/
