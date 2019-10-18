const Command = require('./structures/Command.js');
const Validate = require('./utils/Validate.js');
const RequireAll = require("./utils/RequireAll");
const Room = require("./structures/Room.js");

const {
  MatrixClient,
  SimpleFsStorageProvider
} = require("matrix-bot-sdk");

class Client {
  constructor(options) {
    Validate.checkDefined(options, 'options');
    Validate.checkString(options.token);
    Validate.checkString(options.homeServer);
    Validate.checkString(options.prefix);
    // Validate.checkString(options.storage);

    // TODO: check storage
    this.storage = options.storagel || new SimpleFsStorageProvider("../storage.json");
    this.token = options.token;
    this.homeServer = options.homeServer;
    this.client = new MatrixClient(this.homeServer, this.token, this.storage);
    this.prefix = options.prefix;
    this.commands = [];
    this.handler = new Handler({
      commands: this.commands
    });

  }

  on(eventName, callBack) {
    this.client.on(eventName, (roomId, event) => callBack(roomId, event))
  }

  start() {
    this.client.start()
  }


  async registerCommandDir(dir) {

    this.registerCommands(await RequireAll(dir));
  }

  registerCommands(commands) {

    Validate.checkArrayType(commands, Command);
    console.log("are there commands?", commands);
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

  async checkCommand(roomId, event) {
    if (!event.content) return;

    const content = event.content;
    if (content.msgtype !== 'm.text') return;

    const body = content.body;
    if (!body || !body.startsWith(this.prefix)) return;

    const lowered = body.toLowerCase().slice(this.prefix.length);

    this.handler.run({
       content: body.slice(commandName.length + this.prefix.length),
       room: new Room(),
       author: event.sender
    });

  }
}

module.exports = Client;
