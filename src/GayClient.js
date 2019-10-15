const Command = require('./Command.js');

class GayClient {
  constructor(options) {
    if (options == null)
      throw Error('Invalid options.');

    if (options.client == null)
      throw Error('Invalid client.');

    this.client = options.client;

    if (!Array.isArray(options.commands))
      throw Error('Invalid commands.');

    for (const cmd of options.commands) {
      if (!(cmd instanceof Command))
        throw Error('Invalid command in array.');
    }

    this.commands = options.commands;

    if (typeof(options.prefix) !== 'string')
      throw Error('Invalid prefix.');

    this.prefix = options.prefix;
  }

  async handleEvent(roomId, event) {
    console.log('THIS IS THIS: ');
    console.log(this);
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

module.exports = GayClient;
