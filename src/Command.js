class Command {
  constructor(options) {
    if (options == null)
      throw Error('Invalid command options.');

    if (typeof(options.name) !== 'string')
      throw Error('Invalid command name.');

    this.name = options.name;
  }
}

module.exports = Command;
