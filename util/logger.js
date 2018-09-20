const debug = require('debug')('app:debug');
const info = require('debug')('app:info');
const warn = require('debug')('app:warn');
const error = require('debug')('app:error');

module.exports = {
  debug, info, warn, error
}