Raspberry Pi Low Level IO
=========================

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

**WARNING** This module has been _deprecated_ in favor of [Raspi.js](https://github.com/nebrius/raspi). Raspi.js uses a more advanced mechanism for managing peripherals, and is considerably more performant. Bugs will not be fixed in this module.

The raspi-llio (Low Level Input/Output) module exposes the [Wiring Pi](http://wiringpi.com/) C library to Node.js, which
provides access to GPIO, PWM, I2C, SPI, and UART capabilities. For more in depth information on how raspi-llio works,
visit the Wiring Pi docs. All methods in this library map directly to a Wiring Pi method. Many of the methods are wrapped
up in an object that must first be instantiated and handles file descriptors transparently.

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

The raspi-llio module consists of four namespaces, GPIO, I2C, PWM, and a single method ```getBoardRev```:

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
    - The pin number, as numbered on the P1 header
- mode (```raspi.GPIO.INPUT, raspi.GPIO.OUTPUT```)
    - The mode for the pin
- pullUpDown (```raspi.GPIO.PUD_OFF, raspi.GPIO.PUD_DOWN, raspi.GPIO.PUD_UP```) Optional.
    - Enables a pull up or pull down resistor on the pin

## GPIO Instances

### value digitalRead()

Reads the value on the pin and returns either ```raspi.GPIO.LOW``` or ```raspi.GPIO.HIGH```. Only valid when the pin mode
is ```INPUT```.

### digitalWrite(value)

The digital write method takes one parameter, either ```raspi.GPIO.LOW``` or ```raspi.GPIO.HIGH``` and sets the pin value.
Only valid when the pin mode is ```OUTPUT```

## PWM

Generating a PWM output works like GPIO; you first instantiate a PWM instance and then call ```pwmWrite```. To control a servo:

```javascript
var raspi = require('raspi-llio');

var pwm = new raspi.PWM();
raspi.PWM.setMode(0);
raspi.PWM.setClockDivisor(400);
raspi.PWM.setRange(1000);

var value = 40;
setInterval(function() {
  if (value == 40) {
    value = 90;
  } else {
    value = 40;
  }
  pwm.write(value);
}, 2000);
```

**Important**: If you are driving a servo, the value should be between about 40 and 90 for 90 degree servos, and 20 and 110 for 180
degree servos. Make sure to test these values with your specific servo and make sure you aren't overdriving your servo,
as this can also harm your Raspberry Pi. Also make sure that you have a good power supply because the 5V power
on the Raspberry Pi is notoriously fickle. If you see that your Raspberry Pi is being reset when trying to drive a sero,
you will need to either get a better power supply for your Raspberry Pi, or you will need to power the servo using an
external source.

### new _constructor_()

Instantiates a new PWM channel instance.

### setMode(mode)

Sets the PWM mode, must be one of ```raspi.PWM.PWM_MODE_MS``` or ```raspi.PWM.PWM_MODE_BAL```. See the [BCM2835 ARM Peripherals datasheet](http://www.raspberrypi.org/wp-content/uploads/2012/02/BCM2835-ARM-Peripherals.pdf)
for more information.

### setRange(range)

Sets the value of the PWM range register. See the [BCM2835 ARM Peripherals datasheet](http://www.raspberrypi.org/wp-content/uploads/2012/02/BCM2835-ARM-Peripherals.pdf)
for more information.

### setClockDivisor(divisor)

Sets the PWM clock divisor. See the [BCM2835 ARM Peripherals datasheet](http://www.raspberrypi.org/wp-content/uploads/2012/02/BCM2835-ARM-Peripherals.pdf)
for more information.

## PWM Instances

### write(value)

Sets the PWM duty cycle to ```value / 1000```, assuming the default clock divisor and range.  The value should be between
0 and the max PWM value. The max PWM value is set by ```raspi.PWM.setPwmRange()``` and defaults to 1024.

## I2C

Interfacing with I2C devices requires instantiating a new instance that represents an external device attached via I2C:

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

**Note:** If you encounter a "No such file or directory" error when trying to use I2C peripherals, you may need to load the I2C driver from the command line with:

```
gpio load i2c
```

### new _constructor_(address)

Instantiates a new I2C peripheral instance that corresponds to the device at the given address.

## I2C Instances

### data read()

Reads some data from the I2C peripheral. Blocks if there is nothing to read until something can be read.

### write(data)

Writes some data to the I2C peripheral.

### writeReg8(register, data)

Writes some data to an 8-bit register in the I2C peripheral.

### writeReg16(register, data)

Writes some data to a 16-bit register in the I2C peripheral.

### data readReg8(register)

Reads some data from an 8-bit register in the I2C peripheral.

### data readReg16(register)

Reads some data from a 16-bit register in the I2C peripheral.

## SPI

Interfacing with an SPI device requires instantiating an SPI instance representing an SPI channel at a certain speed:

```javascript
var raspi = require('raspi-llio');

var spi = new raspi.SPI(0, 1000000); // Creates an SPI on channel 0 running at 1Mbps
spi.readWrite('Hello World');
```

**Warning**: the SPI module is untested

### new _constructor_(channel, speed)

Instantiates a new SPI instance with the given channel, which must be 0 or 1, at the specified speed in bps, which must be
between 500000 and 32000000.

## SPI Instances

### data_out readWrite(data_in)

Simultaneously reads and writes data to/from the SPI device.

**Note:** If you encounter a "No such file or directory" error when trying to use SPI peripherals, you may need to load the SPI driver from the command line with:

```
gpio load spi
```

## UART

Interfacing with a UART-compatible device (i.e. TTY devices) requires instantiating a UART instance for a device at a given BAUD rate.

```javascript
var raspi = require('raspi-llio');

var uart = new raspi.UART('/dev/ttyAMA0', 115200);
setInterval(function() {
  var data = '';
  while (uart.dataAvailable()) {
    data += uart.getCharacter();
  };
  if (data) {
    console.log(data);
  }
}, 500);
```

**Warning**: the UART module is untested

### new _constructor_(device, baud)

Instantiates a UART instance for the given device (e.g. ```/dev/tty0```) at a given BAUD rate, which must be a positive integer.

## UART Instances

### write(data)

Writes the given string to the UART device.

### amount dataAvailable()

Returns the number of characters available for reading.

### char getCharacter()

Gets a single character from the device. Blocks for up to 10 seconds before throwing an error if no data is available.

### flush()

Flushes the serial device.

## Further Reading

You may also be interested in the [Raspi IO](https://github.com/bryan-m-hughes/raspi-io) library, which provides a more abstract API that is compatible with [Johnny-Five](https://github.com/rwaldron/johnny-five).

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
