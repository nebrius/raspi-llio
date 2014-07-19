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
var constants = require('./constants');

// Create the interface to the wiringPi interface
var pi = ffi.Library('libwiringPi', {
  pwmSetMode: [ 'void', [ 'int' ]],
  pwmSetRange: [ 'void', [ 'int' ]],
  pwmSetClock: [ 'void', [ 'int' ]],
  piBoardRev: [ 'int', [] ]
});

module.exports.setPwmMode = function pwmSetMode(mode) {
  if (mode != constants.PWM_MODE_MS && mode != constants.PWM_MODE_BAL) {
    throw new Error('Invalid PWM mode "' + mode + '". Mode must be raspi.constants.PWM_MODE_MS or raspi.constants.PWM_MODE_BAL');
  }
  pi.pwmSetMode(mode);
};

module.exports.setPwmRange = function setPwmRange(range) {
  if (typeof range != 'number' || range <= 0) {
    throw new Error('Invalid PWM range "' + range + '". Range must be number greater than 0');
  }
  pi.pwmSetRange(range);
};

module.exports.setPwmClockDivisor = function setPwmClockDivisor(divisor) {
  if (typeof divisor != 'number') {
    throw new Error('Invalid PWM divisor "' + divisor + '". Divisor must be number');
  }
  pi.pwmSetClock(divisor);
};

module.exports.getBoardRev = function getBoardRev() {
  return pi.piBoardRev();
};