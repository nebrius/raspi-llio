/*
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
*/

var ffi = require('ffi');

var pi = ffi.Library('libwiringPi', {
  pwmSetMode: [ 'void', [ 'int' ]],
  pwmSetRange: [ 'void', [ 'int' ]],
  pwmSetClock: [ 'void', [ 'int' ]],
  pinMode: [ 'void', [ 'int', 'int' ] ],
  pullUpDnControl: [ 'void', [ 'int', 'int' ]],
  digitalRead: [ 'int', [ 'int' ]],
  digitalWrite: [ 'void', [ 'int', 'int' ]],
  pwmWrite: [ 'void', [ 'int', 'int' ]],
  analogRead: [ 'int', [ 'int' ]], // Not used
  analogWrite: [ 'void', [ 'int', 'int' ]] // Not used
});


pi.pwmSetMode(0);
pi.pwmSetRange(1000);
pi.pwmSetClock(400);

module.exports = GPIO;

function GPIO(pin, mode, pullUpDown) {
  if (typeof pin != 'number') {
    throw new Error('Invalid GPIO pin "' + pin + '". Pin must be a number');
  }
  if ([
    GPIO.INPUT,
    GPIO.OUTPUT,
    GPIO.PWM_OUTPUT
    //GPIO.GPIO_CLOCK,
    //GPIO.SOFT_PWM_OUTPUT,
    //GPIO.SOFT_TONE_OUTPUT
  ].indexOf(mode) == -1) {
    throw new Error('Invalid GPIO mode "' + mode + '". Mode must a constant specified in raspi.constants');
  }
  if (typeof pullUpDown != 'undefined' && [
    GPIO.PUD_OFF,
    GPIO.PUD_DOWN,
    GPIO.PUD_UP
  ].indexOf(pullUpDown) == -1) {
    throw new Error('Invalid GPIO pull up/down setting "' + pullUpDown +
      '". Pull Up/Down must be a constant specified in raspi.constants');
  }

  Object.defineProperty(this, 'pin', {
    value: pin
  });

  Object.defineProperty(this, 'mode', {
    value: mode
  });
  pi.pinMode(pin, mode);

  if (typeof pullUpDnControl != 'undefined') {
    Object.defineProperty(
      this, 'pullUpDown', {
        value: pullUpDown
      }
    );
    pi.pullUpDnControl(pin, pullUpDown);
  }
}

GPIO.setPwmMode = function pwmSetMode(mode) {
  if (mode != GPIO.PWM_MODE_MS && mode != GPIO.PWM_MODE_BAL) {
    throw new Error('Invalid PWM mode "' + mode + '". Mode must be raspi.constants.PWM_MODE_MS or raspi.constants.PWM_MODE_BAL');
  }
  pi.pwmSetMode(mode);
};

GPIO.setPwmRange = function setPwmRange(range) {
  if (typeof range != 'number' || range <= 0) {
    throw new Error('Invalid PWM range "' + range + '". Range must be number greater than 0');
  }
  pi.pwmSetRange(range);
};

GPIO.setPwmClockDivisor = function setPwmClockDivisor(divisor) {
  if (typeof divisor != 'number') {
    throw new Error('Invalid PWM divisor "' + divisor + '". Divisor must be number');
  }
  pi.pwmSetClock(divisor);
};

GPIO.INPUT = 0;
GPIO.OUTPUT = 1;
GPIO.PWM_OUTPUT = 2;
//GPIO.GPIO_CLOCK = 3;
//GPIO.SOFT_PWM_OUTPUT = 4;
//GPIO.SOFT_TONE_OUTPUT = 5;
GPIO.PUD_OFF = 0;
GPIO.PUD_DOWN = 1;
GPIO.PUD_UP = 2;
GPIO.LOW = 0;
GPIO.HIGH = 1;
GPIO.PWM_MODE_MS = 0;
GPIO.PWM_MODE_BAL = 1;

GPIO.prototype.digitalRead = function() {
  return pi.digitalRead(this.pin);
};

GPIO.prototype.digitalWrite = function(value) {
  if (value != GPIO.LOW && value != GPIO.HIGH) {
    throw new Error('Invalid write value "' + value + '". Value must be raspi.constants.LOW or raspi.constants.HIGH');
  }
  pi.digitalWrite(this.pin, value);
};

GPIO.prototype.pwmWrite = function(value) {
  if (typeof value != 'number') {
    throw new Error('Invalid PWM write value "' + value + '". Value must be a number');
  }
  pi.pwmWrite(this.pin, value);
};