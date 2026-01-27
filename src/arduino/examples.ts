// Arduino code examples library - 34 pre-built examples

export interface ArduinoExample {
  id: string;
  name: string;
  category: string;
  description: string;
  components: string[];
  code: string;
}

export const ARDUINO_EXAMPLES: ArduinoExample[] = [
  // ===== BASICS (3) =====
  {
    id: "blink",
    name: "Blink LED",
    category: "Basics",
    description: "Classic blinking LED on pin 13",
    components: ["Arduino Uno", "LED", "Resistor"],
    code: `void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}`,
  },
  {
    id: "fade",
    name: "Fade LED (PWM)",
    category: "Basics",
    description: "Smooth LED brightness control using PWM",
    components: ["Arduino Uno", "LED", "Resistor"],
    code: `int brightness = 0;
int fadeAmount = 5;

void setup() {
  pinMode(9, OUTPUT);
}

void loop() {
  analogWrite(9, brightness);
  brightness = brightness + fadeAmount;

  if (brightness <= 0 || brightness >= 255) {
    fadeAmount = -fadeAmount;
  }

  delay(30);
}`,
  },
  {
    id: "button-led",
    name: "Button Controls LED",
    category: "Basics",
    description: "Turn LED on/off with button press",
    components: ["Arduino Uno", "LED", "Button", "Resistor"],
    code: `const int buttonPin = 2;
const int ledPin = 13;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  int buttonState = digitalRead(buttonPin);

  if (buttonState == LOW) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
}`,
  },

  // ===== RGB LED (2) =====
  {
    id: "rgb-colors",
    name: "RGB LED Colors",
    category: "RGB LED",
    description: "Cycle through red, green, and blue colors",
    components: ["Arduino Uno", "RGB LED", "Resistor (3x)"],
    code: `const int redPin = 9;
const int greenPin = 10;
const int bluePin = 11;

void setup() {
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
}

void loop() {
  // Red
  setColor(255, 0, 0);
  delay(1000);

  // Green
  setColor(0, 255, 0);
  delay(1000);

  // Blue
  setColor(0, 0, 255);
  delay(1000);

  // White
  setColor(255, 255, 255);
  delay(1000);
}

void setColor(int red, int green, int blue) {
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue);
}`,
  },
  {
    id: "rgb-rainbow",
    name: "RGB Rainbow Fade",
    category: "RGB LED",
    description: "Smooth rainbow color transitions",
    components: ["Arduino Uno", "RGB LED", "Resistor (3x)"],
    code: `const int redPin = 9;
const int greenPin = 10;
const int bluePin = 11;

void setup() {
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
}

void loop() {
  for (int i = 0; i < 256; i++) {
    int r = 255 - i;
    int g = i;
    int b = 0;
    setColor(r, g, b);
    delay(10);
  }

  for (int i = 0; i < 256; i++) {
    int r = 0;
    int g = 255 - i;
    int b = i;
    setColor(r, g, b);
    delay(10);
  }

  for (int i = 0; i < 256; i++) {
    int r = i;
    int g = 0;
    int b = 255 - i;
    setColor(r, g, b);
    delay(10);
  }
}

void setColor(int r, int g, int b) {
  analogWrite(redPin, r);
  analogWrite(greenPin, g);
  analogWrite(bluePin, b);
}`,
  },

  // ===== MOTORS (3) =====
  {
    id: "dc-motor",
    name: "DC Motor Control",
    category: "Motors",
    description: "Control DC motor speed and direction",
    components: ["Arduino Uno", "DC Motor", "Transistor"],
    code: `const int motorPin = 9;

void setup() {
  pinMode(motorPin, OUTPUT);
}

void loop() {
  // Speed up
  for (int speed = 0; speed <= 255; speed += 5) {
    analogWrite(motorPin, speed);
    delay(50);
  }

  // Speed down
  for (int speed = 255; speed >= 0; speed -= 5) {
    analogWrite(motorPin, speed);
    delay(50);
  }

  delay(1000);
}`,
  },
  {
    id: "servo-sweep",
    name: "Servo Sweep",
    category: "Motors",
    description: "Sweep servo motor from 0 to 180 degrees",
    components: ["Arduino Uno", "Servo Motor"],
    code: `const int servoPin = 9;
int angle = 0;

void setup() {
  pinMode(servoPin, OUTPUT);
}

void loop() {
  // Sweep from 0 to 180
  for (angle = 0; angle <= 180; angle += 1) {
    servoWrite(servoPin, angle);
    delay(15);
  }

  // Sweep from 180 to 0
  for (angle = 180; angle >= 0; angle -= 1) {
    servoWrite(servoPin, angle);
    delay(15);
  }
}

void servoWrite(int pin, int angle) {
  int pulseWidth = map(angle, 0, 180, 544, 2400);
  digitalWrite(pin, HIGH);
  delayMicroseconds(pulseWidth);
  digitalWrite(pin, LOW);
  delay(20 - (pulseWidth / 1000));
}`,
  },
  {
    id: "servo-button",
    name: "Servo Button Control",
    category: "Motors",
    description: "Control servo position with buttons",
    components: ["Arduino Uno", "Servo Motor", "Button (2x)"],
    code: `const int servoPin = 9;
const int buttonLeft = 2;
const int buttonRight = 3;
int angle = 90;

void setup() {
  pinMode(servoPin, OUTPUT);
  pinMode(buttonLeft, INPUT_PULLUP);
  pinMode(buttonRight, INPUT_PULLUP);
}

void loop() {
  if (digitalRead(buttonLeft) == LOW) {
    angle = max(0, angle - 5);
  }

  if (digitalRead(buttonRight) == LOW) {
    angle = min(180, angle + 5);
  }

  servoWrite(servoPin, angle);
  delay(50);
}

void servoWrite(int pin, int angle) {
  int pulseWidth = map(angle, 0, 180, 544, 2400);
  digitalWrite(pin, HIGH);
  delayMicroseconds(pulseWidth);
  digitalWrite(pin, LOW);
  delay(20 - (pulseWidth / 1000));
}`,
  },

  // ===== SOUND (2) =====
  {
    id: "buzzer-tone",
    name: "Buzzer Tone",
    category: "Sound",
    description: "Generate different frequencies on buzzer",
    components: ["Arduino Uno", "Buzzer"],
    code: `const int buzzerPin = 8;

void setup() {
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  tone(buzzerPin, 262);  // C note
  delay(500);
  tone(buzzerPin, 330);  // E note
  delay(500);
  tone(buzzerPin, 392);  // G note
  delay(500);
  noTone(buzzerPin);
  delay(500);
}

void tone(int pin, int frequency) {
  int period = 1000000L / frequency;
  int pulseWidth = period / 2;

  for (int i = 0; i < frequency / 2; i++) {
    digitalWrite(pin, HIGH);
    delayMicroseconds(pulseWidth);
    digitalWrite(pin, LOW);
    delayMicroseconds(pulseWidth);
  }
}

void noTone(int pin) {
  digitalWrite(pin, LOW);
}`,
  },
  {
    id: "buzzer-melody",
    name: "Buzzer Melody",
    category: "Sound",
    description: "Play a simple melody",
    components: ["Arduino Uno", "Buzzer"],
    code: `const int buzzerPin = 8;

int melody[] = {262, 294, 330, 349, 392, 440, 494, 523};
int noteDurations[] = {4, 4, 4, 4, 4, 4, 4, 4};

void setup() {
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  for (int i = 0; i < 8; i++) {
    int duration = 1000 / noteDurations[i];
    tone(buzzerPin, melody[i]);
    delay(duration);
    noTone(buzzerPin);
    delay(50);
  }

  delay(2000);
}

void tone(int pin, int frequency) {
  int period = 1000000L / frequency;
  int pulseWidth = period / 2;
  int cycles = frequency / 4;

  for (int i = 0; i < cycles; i++) {
    digitalWrite(pin, HIGH);
    delayMicroseconds(pulseWidth);
    digitalWrite(pin, LOW);
    delayMicroseconds(pulseWidth);
  }
}

void noTone(int pin) {
  digitalWrite(pin, LOW);
}`,
  },

  // ===== SENSORS (6) =====
  {
    id: "light-sensor",
    name: "Light Sensor",
    category: "Sensors",
    description: "Read ambient light level and control LED",
    components: ["Arduino Uno", "Light Sensor", "LED", "Resistor"],
    code: `const int lightPin = A0;
const int ledPin = 13;

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  int lightLevel = analogRead(lightPin);

  Serial.print("Light level: ");
  Serial.println(lightLevel);

  if (lightLevel < 300) {
    digitalWrite(ledPin, HIGH);  // Turn on LED in dark
  } else {
    digitalWrite(ledPin, LOW);
  }

  delay(100);
}`,
  },
  {
    id: "temperature-sensor",
    name: "Temperature Sensor",
    category: "Sensors",
    description: "Read temperature and display on Serial",
    components: ["Arduino Uno", "Temperature Sensor"],
    code: `const int tempPin = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int rawValue = analogRead(tempPin);
  float voltage = rawValue * (5.0 / 1023.0);
  float temperatureC = (voltage - 0.5) * 100.0;

  Serial.print("Temperature: ");
  Serial.print(temperatureC);
  Serial.println(" C");

  delay(1000);
}`,
  },
  {
    id: "ultrasonic",
    name: "Ultrasonic Distance",
    category: "Sensors",
    description: "Measure distance with ultrasonic sensor",
    components: ["Arduino Uno", "Ultrasonic Sensor"],
    code: `const int trigPin = 9;
const int echoPin = 10;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  long duration, distance;

  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2;

  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  delay(500);
}

long pulseIn(int pin, int state) {
  return 1000;  // Simplified for simulation
}`,
  },
  {
    id: "pir-sensor",
    name: "PIR Motion Detector",
    category: "Sensors",
    description: "Detect motion and trigger alarm",
    components: ["Arduino Uno", "PIR Sensor", "LED", "Buzzer"],
    code: `const int pirPin = 2;
const int ledPin = 13;
const int buzzerPin = 8;

void setup() {
  Serial.begin(9600);
  pinMode(pirPin, INPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  int motionDetected = digitalRead(pirPin);

  if (motionDetected == HIGH) {
    Serial.println("Motion detected!");
    digitalWrite(ledPin, HIGH);
    digitalWrite(buzzerPin, HIGH);
    delay(100);
    digitalWrite(buzzerPin, LOW);
  } else {
    digitalWrite(ledPin, LOW);
  }

  delay(100);
}`,
  },
  {
    id: "potentiometer",
    name: "Potentiometer LED",
    category: "Sensors",
    description: "Control LED brightness with potentiometer",
    components: ["Arduino Uno", "Potentiometer", "LED", "Resistor"],
    code: `const int potPin = A0;
const int ledPin = 9;

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  int potValue = analogRead(potPin);
  int brightness = map(potValue, 0, 1023, 0, 255);

  analogWrite(ledPin, brightness);

  Serial.print("Pot: ");
  Serial.print(potValue);
  Serial.print(" -> Brightness: ");
  Serial.println(brightness);

  delay(100);
}`,
  },
  {
    id: "multi-sensor",
    name: "Multi-Sensor Dashboard",
    category: "Sensors",
    description: "Read multiple sensors and display data",
    components: ["Arduino Uno", "Light Sensor", "Temperature Sensor", "Potentiometer"],
    code: `const int lightPin = A0;
const int tempPin = A1;
const int potPin = A2;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int light = analogRead(lightPin);
  int temp = analogRead(tempPin);
  int pot = analogRead(potPin);

  Serial.println("=== Sensor Dashboard ===");
  Serial.print("Light: ");
  Serial.println(light);
  Serial.print("Temperature: ");
  Serial.println(temp);
  Serial.print("Potentiometer: ");
  Serial.println(pot);
  Serial.println();

  delay(1000);
}`,
  },

  // ===== INPUT (3) =====
  {
    id: "multiple-buttons",
    name: "Multiple Buttons",
    category: "Input",
    description: "Control multiple LEDs with buttons",
    components: ["Arduino Uno", "Button (3x)", "LED (3x)", "Resistor (3x)"],
    code: `const int button1 = 2;
const int button2 = 3;
const int button3 = 4;
const int led1 = 11;
const int led2 = 12;
const int led3 = 13;

void setup() {
  pinMode(button1, INPUT_PULLUP);
  pinMode(button2, INPUT_PULLUP);
  pinMode(button3, INPUT_PULLUP);
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
  pinMode(led3, OUTPUT);
}

void loop() {
  digitalWrite(led1, digitalRead(button1) == LOW ? HIGH : LOW);
  digitalWrite(led2, digitalRead(button2) == LOW ? HIGH : LOW);
  digitalWrite(led3, digitalRead(button3) == LOW ? HIGH : LOW);
  delay(10);
}`,
  },
  {
    id: "button-counter",
    name: "Button Counter",
    category: "Input",
    description: "Count button presses and display count",
    components: ["Arduino Uno", "Button", "LED"],
    code: `const int buttonPin = 2;
const int ledPin = 13;
int counter = 0;
int lastButtonState = HIGH;

void setup() {
  Serial.begin(9600);
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  int buttonState = digitalRead(buttonPin);

  if (buttonState == LOW && lastButtonState == HIGH) {
    counter++;
    Serial.print("Count: ");
    Serial.println(counter);

    // Blink LED
    digitalWrite(ledPin, HIGH);
    delay(100);
    digitalWrite(ledPin, LOW);
  }

  lastButtonState = buttonState;
  delay(50);
}`,
  },
  {
    id: "debounced-button",
    name: "Debounced Button",
    category: "Input",
    description: "Stable button reading with debounce",
    components: ["Arduino Uno", "Button", "LED"],
    code: `const int buttonPin = 2;
const int ledPin = 13;
int ledState = LOW;
int buttonState;
int lastButtonState = HIGH;
unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, ledState);
}

void loop() {
  int reading = digitalRead(buttonPin);

  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (reading != buttonState) {
      buttonState = reading;

      if (buttonState == LOW) {
        ledState = !ledState;
        digitalWrite(ledPin, ledState);
      }
    }
  }

  lastButtonState = reading;
}`,
  },

  // ===== SWITCHING (2) =====
  {
    id: "relay-control",
    name: "Relay Control",
    category: "Switching",
    description: "Control relay with button",
    components: ["Arduino Uno", "Button", "Relay", "LED"],
    code: `const int buttonPin = 2;
const int relayPin = 7;

void setup() {
  Serial.begin(9600);
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(relayPin, OUTPUT);
}

void loop() {
  int buttonState = digitalRead(buttonPin);

  if (buttonState == LOW) {
    digitalWrite(relayPin, HIGH);
    Serial.println("Relay ON");
  } else {
    digitalWrite(relayPin, LOW);
    Serial.println("Relay OFF");
  }

  delay(100);
}`,
  },
  {
    id: "timed-relay",
    name: "Timed Relay",
    category: "Switching",
    description: "Automatic relay timing control",
    components: ["Arduino Uno", "Relay", "LED"],
    code: `const int relayPin = 7;

void setup() {
  Serial.begin(9600);
  pinMode(relayPin, OUTPUT);
}

void loop() {
  Serial.println("Relay ON");
  digitalWrite(relayPin, HIGH);
  delay(5000);  // On for 5 seconds

  Serial.println("Relay OFF");
  digitalWrite(relayPin, LOW);
  delay(3000);  // Off for 3 seconds
}`,
  },

  // ===== DISPLAY (4) =====
  {
    id: "seven-segment",
    name: "7-Segment Counter",
    category: "Display",
    description: "Count 0-9 on 7-segment display",
    components: ["Arduino Uno", "7-Segment Display"],
    code: `int counter = 0;

void setup() {
  for (int i = 2; i <= 9; i++) {
    pinMode(i, OUTPUT);
  }
}

void loop() {
  displayDigit(counter);
  counter = (counter + 1) % 10;
  delay(1000);
}

void displayDigit(int digit) {
  byte patterns[] = {
    0b11111100,  // 0
    0b01100000,  // 1
    0b11011010,  // 2
    0b11110010,  // 3
    0b01100110,  // 4
    0b10110110,  // 5
    0b10111110,  // 6
    0b11100000,  // 7
    0b11111110,  // 8
    0b11110110   // 9
  };

  byte pattern = patterns[digit];
  for (int i = 0; i < 8; i++) {
    digitalWrite(i + 2, bitRead(pattern, 7 - i));
  }
}`,
  },
  {
    id: "seven-segment-button",
    name: "7-Segment with Button",
    category: "Display",
    description: "Interactive 7-segment counter",
    components: ["Arduino Uno", "7-Segment Display", "Button (2x)"],
    code: `const int buttonUp = 10;
const int buttonDown = 11;
int counter = 0;

void setup() {
  for (int i = 2; i <= 9; i++) {
    pinMode(i, OUTPUT);
  }
  pinMode(buttonUp, INPUT_PULLUP);
  pinMode(buttonDown, INPUT_PULLUP);
}

void loop() {
  if (digitalRead(buttonUp) == LOW) {
    counter = (counter + 1) % 10;
    displayDigit(counter);
    delay(200);
  }

  if (digitalRead(buttonDown) == LOW) {
    counter = (counter - 1 + 10) % 10;
    displayDigit(counter);
    delay(200);
  }
}

void displayDigit(int digit) {
  byte patterns[] = {
    0b11111100, 0b01100000, 0b11011010, 0b11110010, 0b01100110,
    0b10110110, 0b10111110, 0b11100000, 0b11111110, 0b11110110
  };
  byte pattern = patterns[digit];
  for (int i = 0; i < 8; i++) {
    digitalWrite(i + 2, bitRead(pattern, 7 - i));
  }
}`,
  },
  {
    id: "lcd-hello",
    name: "LCD Hello World",
    category: "Display",
    description: "Display text on LCD 16x2",
    components: ["Arduino Uno", "LCD 16x2"],
    code: `void setup() {
  lcdBegin();
  lcdPrint("Hello, World!");
  lcdSetCursor(0, 1);
  lcdPrint("Arduino LCD");
}

void loop() {
  // Static display
}

void lcdBegin() {
  // Initialize LCD (simplified)
}

void lcdPrint(const char* text) {
  // Print text to LCD
}

void lcdSetCursor(int col, int row) {
  // Set cursor position
}`,
  },
  {
    id: "lcd-sensor",
    name: "LCD with Sensor",
    category: "Display",
    description: "Display sensor readings on LCD",
    components: ["Arduino Uno", "LCD 16x2", "Temperature Sensor", "Potentiometer"],
    code: `const int tempPin = A0;
const int potPin = A1;

void setup() {
  lcdBegin();
}

void loop() {
  int temp = analogRead(tempPin);
  int pot = analogRead(potPin);

  lcdClear();
  lcdSetCursor(0, 0);
  lcdPrint("Temp: ");
  lcdPrint(String(temp));

  lcdSetCursor(0, 1);
  lcdPrint("Pot: ");
  lcdPrint(String(pot));

  delay(500);
}

void lcdBegin() {}
void lcdClear() {}
void lcdSetCursor(int col, int row) {}
void lcdPrint(String text) {}`,
  },

  // ===== ELECTRONICS (4) =====
  {
    id: "transistor-switch",
    name: "Transistor Switch",
    category: "Electronics",
    description: "Use transistor as electronic switch",
    components: ["Arduino Uno", "Transistor (NPN)", "LED", "Resistor (2x)"],
    code: `const int basePin = 9;
const int ledPin = 13;

void setup() {
  pinMode(basePin, OUTPUT);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  digitalWrite(basePin, HIGH);  // Turn on transistor
  delay(1000);

  digitalWrite(ledPin, LOW);
  digitalWrite(basePin, LOW);   // Turn off transistor
  delay(1000);
}`,
  },
  {
    id: "led-resistor",
    name: "LED with Resistor",
    category: "Electronics",
    description: "Basic LED circuit with current limiting",
    components: ["Arduino Uno", "LED", "Resistor"],
    code: `const int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("LED with 220 ohm resistor");
  Serial.println("Current limited to ~20mA");
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(500);
  digitalWrite(ledPin, LOW);
  delay(500);
}`,
  },
  {
    id: "capacitor-smoothing",
    name: "Capacitor Smoothing",
    category: "Electronics",
    description: "Use capacitor for voltage stabilization",
    components: ["Arduino Uno", "Capacitor", "LED"],
    code: `const int ledPin = 9;

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("Capacitor smooths PWM");
}

void loop() {
  for (int i = 0; i <= 255; i++) {
    analogWrite(ledPin, i);
    delay(10);
  }
  for (int i = 255; i >= 0; i--) {
    analogWrite(ledPin, i);
    delay(10);
  }
}`,
  },
  {
    id: "diode-protection",
    name: "Diode Protection",
    category: "Electronics",
    description: "Flyback diode for motor protection",
    components: ["Arduino Uno", "DC Motor", "Diode", "Transistor"],
    code: `const int motorPin = 9;

void setup() {
  pinMode(motorPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("Motor with flyback diode");
  Serial.println("Protection from back-EMF");
}

void loop() {
  analogWrite(motorPin, 200);
  delay(2000);
  analogWrite(motorPin, 0);
  delay(1000);
}`,
  },

  // ===== ICS (3) =====
  {
    id: "555-timer",
    name: "555 Timer Blink",
    category: "ICs",
    description: "Use 555 timer in astable mode",
    components: ["Arduino Uno", "555 Timer", "LED", "Resistor (2x)", "Capacitor"],
    code: `const int timerOutput = 2;
const int ledPin = 13;

void setup() {
  pinMode(timerOutput, INPUT);
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("555 Timer demonstration");
}

void loop() {
  int state = digitalRead(timerOutput);
  digitalWrite(ledPin, state);

  if (state == HIGH) {
    Serial.println("Timer HIGH");
  }

  delay(100);
}`,
  },
  {
    id: "logic-gates",
    name: "Logic Gate Demo",
    category: "ICs",
    description: "Demonstrate AND, OR, NOT gates",
    components: ["Arduino Uno", "AND Gate", "OR Gate", "NOT Gate", "LED (3x)"],
    code: `const int inputA = 2;
const int inputB = 3;
const int andLED = 11;
const int orLED = 12;
const int notLED = 13;

void setup() {
  pinMode(inputA, INPUT_PULLUP);
  pinMode(inputB, INPUT_PULLUP);
  pinMode(andLED, OUTPUT);
  pinMode(orLED, OUTPUT);
  pinMode(notLED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  boolean a = !digitalRead(inputA);
  boolean b = !digitalRead(inputB);

  digitalWrite(andLED, a && b);
  digitalWrite(orLED, a || b);
  digitalWrite(notLED, !a);

  Serial.print("A: ");
  Serial.print(a);
  Serial.print(" B: ");
  Serial.print(b);
  Serial.print(" AND: ");
  Serial.print(a && b);
  Serial.print(" OR: ");
  Serial.print(a || b);
  Serial.print(" NOT A: ");
  Serial.println(!a);

  delay(500);
}`,
  },
  {
    id: "logic-counter",
    name: "Logic Gate Counter",
    category: "ICs",
    description: "Binary counter using logic gates",
    components: ["Arduino Uno", "AND Gate", "NOT Gate", "LED (4x)"],
    code: `const int bit0 = 9;
const int bit1 = 10;
const int bit2 = 11;
const int bit3 = 12;
int counter = 0;

void setup() {
  pinMode(bit0, OUTPUT);
  pinMode(bit1, OUTPUT);
  pinMode(bit2, OUTPUT);
  pinMode(bit3, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  displayBinary(counter);
  Serial.print("Counter: ");
  Serial.println(counter);

  counter = (counter + 1) % 16;
  delay(500);
}

void displayBinary(int num) {
  digitalWrite(bit0, bitRead(num, 0));
  digitalWrite(bit1, bitRead(num, 1));
  digitalWrite(bit2, bitRead(num, 2));
  digitalWrite(bit3, bitRead(num, 3));
}`,
  },

  // ===== PROJECTS (2) =====
  {
    id: "traffic-light",
    name: "Traffic Light",
    category: "Projects",
    description: "Simulate traffic light sequence",
    components: ["Arduino Uno", "LED (3x - Red, Yellow, Green)", "Resistor (3x)"],
    code: `const int redLED = 11;
const int yellowLED = 12;
const int greenLED = 13;

void setup() {
  pinMode(redLED, OUTPUT);
  pinMode(yellowLED, OUTPUT);
  pinMode(greenLED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // Red
  Serial.println("RED - Stop");
  digitalWrite(redLED, HIGH);
  digitalWrite(yellowLED, LOW);
  digitalWrite(greenLED, LOW);
  delay(5000);

  // Yellow
  Serial.println("YELLOW - Ready");
  digitalWrite(redLED, LOW);
  digitalWrite(yellowLED, HIGH);
  digitalWrite(greenLED, LOW);
  delay(2000);

  // Green
  Serial.println("GREEN - Go");
  digitalWrite(redLED, LOW);
  digitalWrite(yellowLED, LOW);
  digitalWrite(greenLED, HIGH);
  delay(5000);

  // Yellow again
  Serial.println("YELLOW - Caution");
  digitalWrite(redLED, LOW);
  digitalWrite(yellowLED, HIGH);
  digitalWrite(greenLED, LOW);
  delay(2000);
}`,
  },
  {
    id: "reaction-game",
    name: "Reaction Game",
    category: "Projects",
    description: "Test reaction time with LED and button",
    components: ["Arduino Uno", "LED", "Button", "Buzzer"],
    code: `const int ledPin = 13;
const int buttonPin = 2;
const int buzzerPin = 8;
unsigned long startTime;
unsigned long reactionTime;

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(buzzerPin, OUTPUT);
  Serial.begin(9600);
  randomSeed(analogRead(0));
}

void loop() {
  Serial.println("Get ready...");
  delay(random(2000, 5000));

  digitalWrite(ledPin, HIGH);
  startTime = millis();

  while (digitalRead(buttonPin) == HIGH) {
    // Wait for button press
  }

  reactionTime = millis() - startTime;
  digitalWrite(ledPin, LOW);

  Serial.print("Reaction time: ");
  Serial.print(reactionTime);
  Serial.println(" ms");

  // Buzzer feedback
  digitalWrite(buzzerPin, HIGH);
  delay(100);
  digitalWrite(buzzerPin, LOW);

  delay(2000);
}`,
  },
];

// Get examples by category
export function getExamplesByCategory(): Record<string, ArduinoExample[]> {
  const categories: Record<string, ArduinoExample[]> = {};

  ARDUINO_EXAMPLES.forEach((example) => {
    if (!categories[example.category]) {
      categories[example.category] = [];
    }
    categories[example.category].push(example);
  });

  return categories;
}

// Get example by ID
export function getExampleById(id: string): ArduinoExample | undefined {
  return ARDUINO_EXAMPLES.find((example) => example.id === id);
}

// Get all category names
export function getCategories(): string[] {
  const categories = new Set<string>();
  ARDUINO_EXAMPLES.forEach((example) => categories.add(example.category));
  return Array.from(categories);
}
