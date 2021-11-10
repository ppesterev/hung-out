import { WebSocket, RawData } from "ws";

import { ServerUpdate } from "../shared/types";

interface User {
  connection: WebSocket;
  score: number;
}

const connectedUsers = new Map<string, User>();

const sendToAll = (message: ServerUpdate) => {
  connectedUsers.forEach(({ connection }) => {
    connection.send(JSON.stringify(message));
  });
};

const onUserMessage = (username: string, data: RawData) => {
  sendToAll({
    userMessage: {
      username,
      text: data.toString()
    }
  });
};

const onDisconnected = (username: string) => {
  connectedUsers.delete(username);
  sendToAll({ serverMessage: `User ${username} disconnected` });
};

export const addPlayer = (connection: WebSocket, username: string | null) => {
  if (!username || connectedUsers.has(username)) {
    connection.send(
      JSON.stringify({
        error: username ? "Username is taken" : "No username provided"
      })
    );
    connection.close();
    return;
  }

  connection.send(
    JSON.stringify({ userList: Array.from(connectedUsers.keys()) })
  );

  connectedUsers.set(username, { connection, score: 0 });
  sendToAll({ serverMessage: `User ${username} connected` });

  connection.on("message", (data) => onUserMessage(username, data));
  connection.on("close", () => onDisconnected(username));
};
