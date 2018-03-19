require = require('esm')(module/*, options*/);
module.exports = require('./main.js').default;

import NotBit from './not-bit';

let niebit = new NotBit();

niebit.publish();
