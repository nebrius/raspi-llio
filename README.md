Raspi
=====

The raspi-llio module exposes the [Wiring Pi](http://wiringpi.com/) C library to Node.js, which provides access to GPIO,
I2C, SPI, and Serial capabilities. For more in depth information on how raspi-llio works, visit the Wiring Pi docs. All
methods in this library map directly to a Wiring Pi method. Many of the methods are wrapped up in an object that must
first be instantiated.

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

### _constructor_

Instantiates a new GPIO pin instance.

#### Parameters:

- pin (_number_)
    - The pin number, as numbered on the P1 header
- mode (```raspi.GPIO.[INPUT, OUTPUT, PWM_OUTPUT, GPIO_CLOCK, SOFT_PWM_OUTPUT, SOFT_TONE_OUTPUT]```)
    - The mode for the pin. Note tht ```PWM_OUTPUT``` is only valid for pin 12 and ```GPIO_CLOCK``` is only valid for pin 7
- pullUpDown (```raspi.GPIO.[PUD_OFF, PUD_DOWN, PUD_UP]```) Optional.
    - Enables a pull up or pull down resistor on the pin

#### Returns:

A GPIO instance, as described below.

### setPwmMode

Sets the PWM mode. The default mode works for most applications, so only modify this if you know what you are doing.
See the [BCM2835 ARM Peripherals datasheet](http://www.raspberrypi.org/wp-content/uploads/2012/02/BCM2835-ARM-Peripherals.pdf)
for more information.

### setPwmRange

Sets the value of the PWM range register. See the [BCM2835 ARM Peripherals datasheet](http://www.raspberrypi.org/wp-content/uploads/2012/02/BCM2835-ARM-Peripherals.pdf)
for more information.

### setPwmClockDivisor

Sets the PWM clock divisor. See the [BCM2835 ARM Peripherals datasheet](http://www.raspberrypi.org/wp-content/uploads/2012/02/BCM2835-ARM-Peripherals.pdf)
for more information.

## GPIO Instances

A GPIO instance with the following methods: ```digitalRead```, ```digitalWrite```, and ```pwmWrite```

### digitalRead

The digital read method takes no parameters and returns either ```raspi.GPIO.LOW``` or ```raspi.GPIO.HIGH```

### digitalWrite

The digital write method takes one parameter, either ```raspi.GPIO.LOW``` or ```raspi.GPIO.HIGH```, and returns nothing

### pwmWrite

The pwm write method takes one parameter,a number, and returns nothing. The value should be between 0 and the max PWM value.
The max PWM value is set by ```raspi.GPIO.setPwmRange()``` and defaults to 1024.

## I2C

## SPI

## Serial

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
