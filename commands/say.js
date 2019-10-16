const Command = require("../src/Command.js");
class Say extends Command{
	constructor(){
		
		super({
			names: ["say", "repeat"]
	        });
	console.log(this.names);	
	 }
	 run(message){
		 
		 console.log(message.content.split(" ").slice(1, -1))
		 message.room.sendMessage(message.content);
	 }
}
module.exports =  new Say();
