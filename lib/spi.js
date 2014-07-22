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
  wiringPiSPISetup: [ 'int', [ 'int', 'int' ] ],
  wiringPiSPIDataRW: [ 'int', [ 'int', stringPtr, 'int' ] ]
});

module.exports = SPI;

function SPI(channel, speed) {
  if (channel !== 0 && channel !== 1) {
    throw new Error('Invalid SPI channel "' + channel + '". Channel must be either 0 or 1');
  }
  if (typeof speed != 'number' || speed < 500000 || speed > 32000000) {
    throw new Error('Invalid SPI speed "' + speed + '". Speed must be an integer between 50,000 and 32,000,000');
  }
  var fd = pi.wiringPiSPISetup(channel, speed);
  if (fd < 0) {
    throw new Error('Could not initialize SPI: Internal error ' + ffi.errno());
  }
  Object.defineProperty(this, 'fd', {
    value: fd
  });
}

SPI.prototype.readWrite = function readWrite(data) {
  var dataBuffer = ref.allocCString(data);
  var result = pi.wiringPiSPIDataRW(this.fd, dataBuffer, dataBuffer.length);
  if (result < 0) {
    throw new Error('Could not read from SPI: Internal error ' + ffi.errno());
  }
  return ref.readCString(dataBuffer);
};
