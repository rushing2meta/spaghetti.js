function throwIf(condition, message) {
  if (condition)
    throw Error(message);
}

module.exports = {
  checkString(val) {
    throwIf(typeof(val) !== 'string', `Invalid string: ${val}`);
  },

  checkFunction(val, argCount) {
    throwIf(typeof(val) !== 'function', `Invalid function: ${val}`);
    throwIf(val.length !== argCount, `Invalid function argument count: ${val}`);
  },

  checkArray(val) {
    throwIf(!Array.isArray(val), `Invalid array: ${val}`);
  },

  checkDefined(val, what) {
    throwIf(val == null, `Invalid ${what}.`);
  },

  checkType(val, ctor) {
    const isType = val instanceof ctor;
    const typeName = val.constructor.name;
    throwIf(!isType, `Invalid type ${typeName}, expected ${ctor.name}.`);
  },

  checkArrayType(val, ctor) {
    this.checkArray(val);

    for (const elem in val)
      this.checkType(elem, ctor);
  },

  checkArrayString(val) {
    this.checkArray(val);

    for (const elem in val)
      checkString(elem);
  },

  checkLength(val, what) {
    throwIf(val.length === 0, `${what} cannot be empty.`);
  }
};
