const Command = require('./Command.js');
const Validate = require('./utils/Validate.js');
const RequireAll = require('./utils/RequireAll.js');

class Bot {
  constructor(options) {
    Validate.checkDefined(options, 'options');
    Validate.checkString(options.token);
    Validate.checkString(options.homeserver);
    Validate.checkString(options.prefix);

    // TODO: actually use the token and stuff to login
    this.token = options.token;
    this.homeserver = options.homeserver;
    this.prefix = options.prefix;
    this.commands = [];
  }

  registerCommandDir(dir) {
    registerCommands(RequireAll(dir));
  }

  registerCommands(commands) {
    Validate.checkArrayType(commands, Command);

    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];

      Validate.checkFunction(cmd.constructor.run, 3);

      for (let j = 0; j < cmd.names.length; j++) {
        const name = cmd.names[j];

        if (this.commands.some(c => c.names.some(n => this.equals(n, name))))
          throw new Error(`The '${name}' command is already registered.`);
      }

      this.commands.push(cmd);
    }

    return this;
  }

  // TODO: .on() method that handles messages and does all the good checks
  async handleEvent(roomId, event) {
    if (!event['content'])
      return;

    if (event['content']['msgtype'] !== 'm.text')
      return;

    if (event['sender'] === await this.client.getUserId())
      return;

    const body = event['content']['body'];
    if (!body || !body.startsWith(this.prefix))
      return;

    const lowered = body.toLowerCase().slice(this.prefix.length);
    for (const cmd of this.commands) {
      if (lowered.startsWith(cmd.name))
        cmd.run(this.client, roomId, body);
    }
  }
}

module.exports = Bot;
