import { WebSocket, RawData } from "ws";

import { GameSession } from "./game-session";
import { ServerUpdate, UserMessage, GameUpdate } from "../shared/types";

const connectedUsers = new Map<string, WebSocket>();
const gameSession = new GameSession();

const sendToAll = (message: ServerUpdate) => {
  connectedUsers.forEach((connection) => {
    connection.send(JSON.stringify(message));
  });
};

const onUserMessage = (username: string, data: RawData) => {
  const userMessage = JSON.parse(data.toString()) as UserMessage;
  const response: ServerUpdate = {
    userMessage: {
      username,
      text: userMessage.text
    }
  };

  if (userMessage.isGuess) {
    response.gameUpdate = gameSession.makeGuess(username, userMessage.text);
  }

  sendToAll(response);
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
    JSON.stringify({
      userList: Array.from(connectedUsers.keys()),
      gameUpdate: gameSession.getGameState()
    })
  );

  // first connection
  if (connectedUsers.size === 0) {
    gameSession.start(
      (endResult) => {
        sendToAll({ serverMessage: "Round over, restarting in 3s" });
      },
      (initialState) => {
        sendToAll({ gameUpdate: initialState });
      }
    );
  }

  connectedUsers.set(username, connection);
  gameSession.addPlayer(username);
  sendToAll({ serverMessage: `User ${username} connected` });

  connection.on("message", (data) => onUserMessage(username, data));
  connection.on("close", () => onDisconnected(username));
};
