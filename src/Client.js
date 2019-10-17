const Command = require('./Command.js');
const Validate = require('./utils/Validate.js');
const RequireAll = require("./utils/RequireAll");
const { MatrixClient,
	SimpleFsStorageProvider
}	= require("matrix-bot-sdk");
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


  }
  on(eventName, callBack){
    this.client.on(eventName, (roomId, event) => callBack(roomId, event))
  }
  start(){
    this.client.start()
  }
  send(roomId, msgtype, body){
    this.client.sendMessage(roomId, {
      msgtype: msgtype,
      body: body,
    });
  }
  async registerCommandDir(dir) {

	  this.registerCommands(await RequireAll(dir));
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
  async checkCommand(roomId, event) {
    if (!event['content'])
      return;

    if (event['content']['msgtype'] !== 'm.text')
      return;


    const body = event['content']['body'];
    if (!body || !body.startsWith(this.prefix))
      return;

    const lowered = body.toLowerCase().slice(this.prefix.length);
    for(cmd of this.commands){

      let commandName;
      cmd.names.some(name =>{
	     if( lowered.startsWith(name)) commandName = name;
      });
      if (commandName)
        cmd.run({
			content: body.slice(commandName.length + this.prefix.length),
		room: {
			sendMessage: (message) => {
				this.send(roomId, 'm.text', message)
			},
			id: roomId
		},
		author: event.sender

	});
    }
  }
}

module.exports = Client;
