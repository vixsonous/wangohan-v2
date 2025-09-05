import {Response} from "express";

export type Client = {
  id: string;
  res: Response
}

export class RecipeEvents {
  clients: Client[] = [];

  addClient(client: Client) {
    this.clients.push(client);
  }

  removeClient(id: string) {
    this.clients = this.clients.filter(client => client.id !== id);
  }

  sendEvent(message: string) {
    this.clients.forEach(client => {
      client.res.write(message);
    });
  }

  sendMessageToClient(message: string, id: string) {
    const clients = this.clients.filter(client => client.id.includes(id));

    clients.forEach(client => {
      console.log(client.id);
      client.res.write(`data: ${message}\n\n`);
    })
  }
}