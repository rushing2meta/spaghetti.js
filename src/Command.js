const Validate = require('../Validate.js');

// TODO: argument class, and argument validation
class Command {
  constructor(options) {
    Validate.checkDefined(options, 'options');
    Validate.checkArrayString(options.names);
    Validate.checkLength(options.names, 'names');
    // TODO: check to make sure all names are all lowercase?
  }
}

module.exports = Command;
