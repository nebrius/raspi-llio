Raspberry Pi Low Level IO
=========================

The raspi-llio (Low Level Input/Output) module exposes the [Wiring Pi](http://wiringpi.com/) C library to Node.js, which provides access to GPIO and
I2C capabilities, with SPI and UART capabilities coming soon. For more in depth information on how raspi-llio works, visit the Wiring Pi docs. All
methods in this library map directly to a Wiring Pi method. Many of the methods are wrapped up in an object that must
first be instantiated and handles file descriptors transparently.

# Installation

Before using raspi-llio, you must install the Wiring Pi library on your Raspberry Pi:

```
git clone git://git.drogon.net/wiringPi
cd wiringPi
./build
```

Once that is done:

```
npm install raspi-llio
```

# API

## Root Namespace

The raspi-llio module consists of four namespaces, GPIO, I2C, SPI, and Serial, and a single method ```getBoardRev```:

### getBoardRev

The ```getBoardRev``` method takes no parameters and returns either 1 or 2, indicating if this is a Raspberry Pi Model B
rev 1 or 2.

## GPIO

Using GPIO is straightforward, just create an instance of a pin and call ```digitalWrite``` or ```digitalRead```:

```javascript
var raspi = require('raspi-llio');

var pin7 = new raspi.GPIO(7, raspi.GPIO.OUTPUT);
var pin11 = new raspi.GPIO(11, raspi.GPIO.INPUT);

console.log(pin11.digitalRead() == raspi.GPIO.LOW); // Prints true
pin7.digitalWrite(raspi.GPIO.HIGH);
console.log(pin11.digitalRead() == raspi.GPIO.HIGH); // Prints true
```

### new _constructor_(pin, mode, [pullUpDown])

Instantiates a new GPIO pin instance.

#### Parameters:

- pin (_number_)
    - The pin number, as numbered on the P1 header. Note: if using mode ```PWM_OUTPUT```, set the pin to ```1``` (for PWM channel 1) not ```12```.
- mode (```raspi.GPIO.INPUT, raspi.GPIO.OUTPUT, raspi.GPIO.PWM_OUTPUT```)
    - The mode for the pin. Note tht ```PWM_OUTPUT``` is only valid for pin 12
- pullUpDown (```raspi.GPIO.PUD_OFF, raspi.GPIO.PUD_DOWN, raspi.GPIO.PUD_UP```) Optional.
    - Enables a pull up or pull down resistor on the pin

### setPwmMode(mode)

Sets the PWM mode, must be one of ```raspi.GPIO.PWM_MODE_MS``` or ```raspi.GPIO.PWM_MODE_BAL```. The default mode (raspi.GPIO.PWM_MODE_MS) works for most applications, so only modify this if you know what you are doing.
See the [BCM2835 ARM Peripherals datasheet](http://www.raspberrypi.org/wp-content/uploads/2012/02/BCM2835-ARM-Peripherals.pdf)
for more information.

#### Parameters:
- mode (```raspi.GPIO.PWM_MODE_MS, raspi.GPIO.PWM_MODE_BAL```)
    - The PWM mode. See the datasheet for a description of the modes.

### setPwmRange(range)

Sets the value of the PWM range register. See the [BCM2835 ARM Peripherals datasheet](http://www.raspberrypi.org/wp-content/uploads/2012/02/BCM2835-ARM-Peripherals.pdf)
for more information.

### setPwmClockDivisor(divisor)

Sets the PWM clock divisor. See the [BCM2835 ARM Peripherals datasheet](http://www.raspberrypi.org/wp-content/uploads/2012/02/BCM2835-ARM-Peripherals.pdf)
for more information.

## GPIO Instances

### value digitalRead()

Reads the value on the pin and returns either ```raspi.GPIO.LOW``` or ```raspi.GPIO.HIGH```. Only valid when the pin mode
is ```INPUT```.

### digitalWrite(value)

The digital write method takes one parameter, either ```raspi.GPIO.LOW``` or ```raspi.GPIO.HIGH``` and sets the pin value.
Only valid when the pin mode is ```OUTPUT```

### pwmWrite(value)

Sets the PWM duty cycle to ```value / 1000```, assuming the default clock divisor and range.  The value should be between
0 and the max PWM value. The max PWM value is set by ```raspi.GPIO.setPwmRange()``` and defaults to 1000. This method is
only valid for pin 12.

Note: if you are using a servo, the value should be between about 40 and 90 for 90 degree servos, and 20 and 110 for 180
degree servos. Make sure to test these values with your specific servo and make sure you aren't overdriving your servo,
as this can also harm your Raspberry Pi. Also make sure that you have a good power supply because the 5V power supply
on the Raspberry Pi is notoriously fickle.

Servo exmaple:

```javascript
var raspi = require('raspi-llio');

var pwm = new raspi.GPIO(1, raspi.GPIO.PWM_OUTPUT);

var value = 20;
setInterval(function() {
  if (value == 20) {
    value = 110;
  } else {
    value = 20;
  }
  pwm.pwmWrite(value);
}, 2000);
```

## I2C

Interfacing with I2C devices works similarly to working with GPIO devices. First instantiate an I2C object by feeding
the constructor the address of the I2C peripheral. 

```javascript
var raspi = require('raspi-llio');

var sensor = new raspi.I2C(0x18);

setInterval(function(){
  console.log(sensor.readReg16(5));
}, 500);
```

Some I2C devices work by being read from/written to directly. In these cases, use the ```read``` and ```write``` methods.
Most devices are register based, however, so use the ```readRegX``` and ```writeRegX``` methods. Consult the data sheets
for the I2C device to determine which method is appropriate.

### new _constructor_(address)

Instantiates a new I2C peripheral instance that corresponds to the device at the given address.

## I2C Instances

### read

Reads some data from the I2C peripheral. Blocks if there is nothing to read until something can be read.

### write

Writes some data to the I2C peripheral.

### writeReg8

Writes some data to an 8-bit register in the I2C peripheral.

### writeReg16

Writes some data to a 16-bit register in the I2C peripheral.

### readReg8

Reads some data from an 8-bit register in the I2C peripheral.

### readReg16

Reads some data from a 16-bit register in the I2C peripheral.

License
=======

The MIT License (MIT)

Copyright (c) 2014 Bryan Hughes <bryan@theoreticalideations.com>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the 'Software'), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
