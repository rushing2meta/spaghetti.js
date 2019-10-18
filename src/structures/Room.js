class Room{
  construcot(id, client){
    this.id = id;
    this.client = client;
  }
  sendMessage(message){
    this.client.sendMessage(this.id, {
      msgtype: "m.text",
      body: message,
    });
  }
}
