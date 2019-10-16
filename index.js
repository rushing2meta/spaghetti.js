const Client = require("./src/Client.js");
const config = require("./config.json");

const client = new Client(config);

client.registerCommandDir("./commands");

client.on("room.message", (roomId, e) => {
	client.checkCommand(rooomId, e);
	console.log("a message");
});

