const Client = require("./src/Client.js");
const config = require("./config.json");

const client = new Client(config);

//client.registerCommandDir("/commands");
const say = require("./commands/say.js");
client.commands.push(say);
console.log(say.names);

client.on("room.message", (roomId, e) => {
	client.checkCommand(roomId, e);
});


client.start()
console.log("bot started");
