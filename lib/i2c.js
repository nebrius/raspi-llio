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

// Create the interface to the wiringPi interface
var pi = ffi.Library('libwiringPi', {
  wiringPiI2CSetup: [ 'int', [ 'int' ] ],
  wiringPiI2CRead: [ 'int', [ 'int' ] ],
  wiringPiI2CWrite: [ 'int', [ 'int', 'int' ] ],
  wiringPiI2CWriteReg8: [ 'int', [ 'int', 'int', 'int' ] ],
  wiringPiI2CWriteReg16: [ 'int', [ 'int', 'int', 'int' ] ],
  wiringPiI2CReadReg8: [ 'int', [ 'int', 'int' ] ],
  wiringPiI2CReadReg16: [ 'int', [ 'int', 'int' ] ]
});

module.exports = I2C;

function I2C(address) {
  if (typeof address != 'number') {
    throw new Error('Invalid I2C address "' + address + '". Addresses must be a number');
  }
  var fd = pi.wiringPiI2CSetup(address);
  if (fd < 0) {
    throw new Error('Could not initialize I2C: Internal error ' + ffi.errno());
  }
  Object.defineProperty(this, 'fd', {
    value: fd
  });
}

I2C.prototype.read = function read() {
  var result = pi.wiringPiI2CRead(this.fd);
  if (result < 0) {
    throw new Error('Could not read from I2C: Internal error ' + ffi.errno());
  }
  return result;
};

I2C.prototype.write = function write(data) {
  if (typeof data != 'number') {
    throw new Error('Invalid write data "' + data + '". Data must be a number');
  }
  if (pi.wiringPiI2CWrite(this.fd, data) < 0) {
    throw new Error('Could not write to I2C: Internal error ' + ffi.errno());
  }
};

I2C.prototype.writeReg8 = function writeReg8(register, data) {
  if (typeof register != 'number') {
    throw new Error('Invalid write register "' + data + '". Register must be a number');
  }
  if (typeof data != 'number') {
    throw new Error('Invalid write data "' + data + '". Data must be a number');
  }
  if (pi.wiringPiI2CWriteReg8(this.fd, register, data) < 0) {
    throw new Error('Could not write to I2C: Internal error ' + ffi.errno());
  }
};

I2C.prototype.writeReg16 = function writeReg16(register, data) {
  if (typeof register != 'number') {
    throw new Error('Invalid write register "' + data + '". Register must be a number');
  }
  if (typeof data != 'number') {
    throw new Error('Invalid write data "' + data + '". Data must be a number');
  }
  if (pi.wiringPiI2CWriteReg16(this.fd, register, data) < 0) {
    throw new Error('Could not write to I2C: Internal error ' + ffi.errno());
  }
};

I2C.prototype.readReg8 = function readReg8(register) {
  if (typeof register != 'number') {
    throw new Error('Invalid read register "' + register + '". Register must be a number');
  }
  var result = pi.wiringPiI2CReadReg8(this.fd, register);
  if (result < 0) {
    throw new Error('Could not read from I2C: Internal error ' + ffi.errno());
  }
  return register;
};

I2C.prototype.readReg16 = function readReg8(register) {
  if (typeof register != 'number') {
    throw new Error('Invalid read register "' + register + '". Register must be a number');
  }
  var result = pi.wiringPiI2CReadReg16(this.fd, register);
  if (result < 0) {
    throw new Error('Could not read from I2C: Internal error ' + ffi.errno());
  }
  return register;
};
