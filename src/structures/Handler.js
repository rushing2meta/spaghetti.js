const ArgumentDefault = require("../enums/ArgumentDefualt.js");

class Handler {

  constructor(commands, argumentRegex){
    this.commands = commands;
    if (argumentRegex == null ||  argumentRegex == undefined) {
      this.argumentRegex = Constants.regexes.argument;
      this.hasDefaultRegex = true;
    } else {
      this.argumentRegex = argumentRegex;
      this.hasDefaultRegex = this.argumentRegex === Constants.regexes.argument;
    }

  }

  checkCommand(message){
    const givenCommandName = message.match(this.argumentRegex)[0];

    for(let cmd in this.commands){

      for(let name in cmd.names){

        if(name == givenCommandName){
          return cmd;

        }
      }
    }
  }

  checkInfniteArg(msg, cmd, i, args, split){

    return {
    };
  }

  checkArgs(msg, cmd, prefixLength) {
   const args = {};
   let split = cnt.match(this.argumentRegex);

   cnt = (split.length > 1) ? cnt = cnt.slice(cnt.indexOf(split[1], split[0].length)) :"";

   split = split.slice(1);

   for (let i = 0; i < cmd.args.length; i++) {
     let val;

     if (cmd.args[i].infinite) {
       const res = await this.checkInfiniteArg(msg, cmd, i, args, split);

       if (res != null) {
         if (res.success === false) return res;

         val = res;
       }

     } else {
       let res = await this.checkFiniteArg(msg, cmd, i, args, cnt, split);

       val = res.result.value;
       cnt = res.content;

       if (res.result.success === false)  return res.result;

       res = await this.runArgPreconditions(msg, cmd, i, args, val);
       if (res != null) return res;

      }
        args[cmd.args[i].key] = val;
    }
    return {
      run: command.run,
      argumentsSet: this.checkAllArgumentsSet(args)
    }
  }

  checkALlArgumentsSet(args){
    for(arg in args){
      if(arg) continue;
      return false;
    }
    return true;
  }

  run(message){
    let command = this.checkCommand(message);

    if(command){
      command = this.checkArgs(message.slice(command, message), command);

    } else {
      return;

    }

    if(command.argumentsSet){
      command.run(message);

    } else {
      return;

    }

  }
  defaultValue(defaultValue, message) {
    switch (defaultValue) {
      case ArgumentDefault.Author:
        return message.author;
      case ArgumentDefault.room:
        return message.room;
      default:
        return defaultValue;
    }
  }
  static validateHandler(handler){
    if(!Array.isArray(handler.commands)){
      throw  new TypeError("Handler: The commands must be an array");
    } else if (!(handler.argumentRegex instanceof RegExp)) {
      throw new TypeError(
        "Handler: The argument regex must be a regular expression."
      );
    }
  }
}
