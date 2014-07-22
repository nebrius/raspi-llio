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
  pinMode: [ 'void', [ 'int', 'int' ] ],
  pullUpDnControl: [ 'void', [ 'int', 'int' ]],
  digitalRead: [ 'int', [ 'int' ]],
  digitalWrite: [ 'void', [ 'int', 'int' ]],
  analogRead: [ 'int', [ 'int' ]], // Not used
  analogWrite: [ 'void', [ 'int', 'int' ]] // Not used
});

module.exports = GPIO;

function GPIO(pin, mode, pullUpDown) {
  if (typeof pin != 'number') {
    throw new Error('Invalid GPIO pin "' + pin + '". Pin must be a number');
  }
  if (mode != GPIO.INPUT && mode != GPIO.OUTPUT) {
    throw new Error('Invalid GPIO mode "' + mode + '". Mode must be either raspi.GPIO.INPUT or raspi.GPIO.OUTPUT');
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

GPIO.INPUT = 0;
GPIO.OUTPUT = 1;
GPIO.PUD_OFF = 0;
GPIO.PUD_DOWN = 1;
GPIO.PUD_UP = 2;
GPIO.LOW = 0;
GPIO.HIGH = 1;

GPIO.prototype.digitalRead = function digitalRead() {
  return pi.digitalRead(this.pin);
};

GPIO.prototype.digitalWrite = function digitalWrite(value) {
  if (value != GPIO.LOW && value != GPIO.HIGH) {
    throw new Error('Invalid write value "' + value + '". Value must be raspi.constants.LOW or raspi.constants.HIGH');
  }
  pi.digitalWrite(this.pin, value);
};