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

var ref = require('ref');
var ffi = require('ffi');

var stringPtr = ref.refType(ref.types.CString);

// Create the interface to the wiringPi interface
var pi = ffi.Library('libwiringPi', {
  serialOpen: [ 'int', [ 'string', 'int' ] ],
  serialPutchar: [ 'void', [ 'int', 'char' ] ],
  serialPuts: [ 'void', [ 'int', 'string' ] ],
  serialDataAvail: [ 'int', [ 'int' ] ],
  serialGetchar: [ 'int', [ 'int' ] ],
  serialFlush: [ 'void', [ 'int' ] ]
});

module.exports = UART;

function UART(device, baud) {
  if (typeof device != 'string') {
    throw new Error('Invalid UART device "' + device + '". Device must be a string');
  }
  if (typeof baud != 'number' || baud <= 0) {
    throw new Error('Invalid SPI speed "' + speed + '". Speed must be a positive integer');
  }
  var fd = pi.serialOpen(device, baud);
  if (fd < 0) {
    throw new Error('Could not initialize UART: Internal error ' + ffi.errno());
  }
  Object.defineProperty(this, 'fd', {
    value: fd
  });
}

UART.prototype.write = function write(data) {
  if (typeof data != 'string') {
    throw new Error('Invalid write data "' + data + '". Data must be a string');
  }
  pi.serialPuts(this.fd, data);
};

UART.prototype.dataAvailable = function dataAvailable() {
  var result = pi.serialDataAvail(this.fd);
  if (result < 0) {
    throw new Error('Could not get the amount of data available from UART: Internal error ' + ffi.errno());
  }
  return result;
};

UART.prototype.getCharacter = function getCharacter() {
  var result = pi.serialGetchar(this.fd);
  if (result < 0) {
    throw new Error('Could not read from UART: Internal error ' + ffi.errno());
  }
  return result;
};

UART.prototype.flush = function flush() {
  pi.serialFlush();
};
