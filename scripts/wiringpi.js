#!/usr/bin/env node
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

var WIRING_PI_REPO = 'git://git.drogon.net/wiringPi';

var spawn = require('child_process').spawn;
var fs = require('fs');
var os = require('os');
var path = require('path');

var tmpDir = os.tmpDir();
var gpioNotFound = false;

var steps = [ checkGpio, cloneRepo, install ];

nextStep();

function nextStep() {
  var next = steps.shift();
  if (next) {
    next();
  } else {
    console.log('The Wiring Pi library has been successfully installed');
    process.exit(0);
  }
}

function handleReturnCode(code) {
  if (code) {
    console.error(
        'Could not install the Wiring Pi library. ' +
        'You will need to install it manually for raspi to work. Please visit http://wiringpi.com/'
    );
    process.exit(code);
  }
}

function checkGpio() {
  console.log('* Checking if the Wiring Pi library is installed...');
  var gpioCheckProcess = spawn('gpio', [], {
    stdio: 'ignore'
  });
  gpioCheckProcess.on('error', function(err) {
    if (err.code == 'ENOENT') {
      gpioNotFound = true;
    } else {
      console.error(err);
      handleReturnCode(-1);
    }
  });
  gpioCheckProcess.on('close', function() {
    if (gpioNotFound) {
      console.log('The Wiring Pi library was not found, installing now. ' +
        'This process requires root privileges, and you may be required to input your password\n');
      nextStep();
    } else {
      console.log('The Wiring Pi library is already installed');
      process.exit(0);
    }
  });
}

function cloneRepo() {
  console.log('* Downloading the Wiring Pi library using git...');

  if (fs.existsSync(path.join(tmpDir, 'wiringPi'))) {
    rm(path.join(tmpDir, 'wiringPi'));
  }

  var gitCloneProcess = spawn('git', ['clone', WIRING_PI_REPO], {
    cwd: tmpDir
  });
  gitCloneProcess.on('error', function(err) {
    console.error(err);
  });
  gitCloneProcess.on('close', function(code) {
    handleReturnCode(code);
    tmpDir = path.join('tmpDir', 'wiringPi');
    nextStep();
  });
  gitCloneProcess.stdout.on('data', function (data) {
    console.log(data.toString());
  });

  gitCloneProcess.stderr.on('data', function (data) {
    console.error(data.toString());
  });
}

function install() {
  var buildProcess = spawn('build', [], {
    cwd: tmpDir
  });
  buildProcess.on('error', function(err) {
    console.error(err);
  });
  buildProcess.on('close', function(code) {
    handleReturnCode(code);
    nextStep();
  });
  buildProcess.stdout.on('data', function (data) {
    console.log(data.toString());
  });

  buildProcess.stderr.on('data', function (data) {
    console.error(data.toString());
  });
}

function rm(root) {
  if (fs.statSync(root).isDirectory()) {
    fs.readdirSync(root).forEach(function(child) {
      rm(path.join(root, child));
    });
    fs.rmdirSync(root);
  } else {
    fs.unlinkSync(root);
  }
}
