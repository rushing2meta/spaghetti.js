const Validate = require('../utils/Validate.js');

class Argument {
  constructor(options){
    this.optional = !options.defaultValue;
    this.defaultValue = options.defaultValue;
    this.example = options.example;
    this.infinite = options.infinite == null ? false : options.infinite;
    this.key = options.key;
    this.name = options.name;
    if (options.preconditionOptions == null)
      this.preconditionOptions = [];
    else
      this.preconditionOptions = options.preconditionOptions;

    if (options.preconditions == null)
      this.preconditions = [];
    else
      this.preconditions = options.preconditions;

    this.remainder = options.remainder == null ? false : options.remainder;
    this.type = options.type;
    this.constructor.validateArgument(this);
  }
  validateArgument(argument) {
    if (typeof argument.example !== "string") {
      throw new TypeError(
        `${argument.constructor.name}: The example must be a string.`
      );
    } else if (typeof argument.infinite !== "boolean") {
      throw new TypeError(
        `${argument.constructor.name}: The infinite setting must be a boolean.`
      );
    } else if (typeof argument.key !== "string"
        || Constants.regexes.whiteSpace.test(argument.key)) {
      throw new TypeError(
        `${argument.constructor.name}: The key must be a string that does not \
        contain any whitespace characters.`
      );
    } else if (typeof argument.name !== "string") {
      throw new TypeError(
        `${argument.constructor.name}: The name must be a string.`
      );
    } else if (!Array.isArray(argument.preconditionOptions)) {
      throw new TypeError(
        `${argument.constructor.name}: The precondition options must be an \
        array.`
      );
    } else if (!Array.isArray(argument.preconditions)
        || argument.preconditions.some(pcnd => typeof pcnd !== "string")) {
      throw new TypeError(
        `${argument.constructor.name}: The preconditions must be an array.`
      );
    } else if (typeof argument.remainder !== "boolean") {
      throw new TypeError(
        `${argument.constructor.name}: The remainder setting must be a \
        boolean.`
      );
    } else if (typeof argument.type !== "string") {
      throw new TypeError(
        `${argument.constructor.name}: The type must be a string.`
      );
    }
  } 
}
