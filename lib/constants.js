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

module.exports = {
  INPUT: 0,
  OUTPUT: 1,
  PWM_OUTPUT: 2,
  GPIO_CLOCK: 3,
  SOFT_PWM_OUTPUT: 4,
  SOFT_TONE_OUTPUT: 5,

  LOW: 0,
  HIGH: 1,

  PUD_OFF: 0,
  PUD_DOWN: 1,
  PUD_UP: 2,

  PWM_MODE_MS: 0,
  PWM_MODE_BAL: 1,

  INT_EDGE_SETUP: 0,
  INT_EDGE_FALLING: 1,
  INT_EDGE_RISING: 2,
  INT_EDGE_BOTH: 3,

  PI_MODEL_A: 0,
  PI_MODEL_B: 1,
  PI_MODEL_CM: 2
};