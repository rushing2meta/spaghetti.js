const Command = require("../src/Command.js");
class say extends Command{
	constructor(){
		super({
			names: ["say", "repeat"],
	        });
		      
	 }
	 run(message){
		 message.room.sendMessage(message.body.split(" ").pop().join);
	 }
}

