import { WebSocket, RawData } from "ws";

import { GameSession } from "./game-session";
import { ServerUpdate, UserMessage } from "../shared/types";

const connectedUsers = new Map<string, WebSocket>();
const gameSession = new GameSession();

const sendToAll = (message: ServerUpdate) => {
  connectedUsers.forEach((connection) => {
    connection.send(JSON.stringify(message));
  });
};

const onUserMessage = (username: string, data: RawData) => {
  const userMessage = JSON.parse(data.toString()) as UserMessage;

  sendToAll({
    userMessage: {
      username,
      text: userMessage.text
    }
  });
};

const onDisconnected = (username: string) => {
  connectedUsers.delete(username);
  gameSession.removePlayer(username);
  sendToAll({ serverMessage: `User ${username} disconnected` });
};

export const addUser = (connection: WebSocket, username: string | null) => {
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

  connectedUsers.set(username, connection);
  gameSession.addPlayer(username);
  sendToAll({ serverMessage: `User ${username} connected` });

  connection.on("message", (data) => onUserMessage(username, data));
  connection.on("close", () => onDisconnected(username));
};
