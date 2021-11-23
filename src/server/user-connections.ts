import { WebSocket, RawData } from "ws";

import { GameSession } from "./game-session";
import { ServerUpdate, ClientMessage } from "../shared/types";

const connectedUsers = new Map<string, WebSocket>();
let gameSession: GameSession | null = null;

const sendToAll = (message: ServerUpdate) => {
  connectedUsers.forEach((connection) => {
    connection.send(JSON.stringify(message));
  });
};

const onUserMessage = (username: string, data: RawData) => {
  const userMessage = JSON.parse(data.toString()) as ClientMessage;
  const response: ServerUpdate = {
    userMessage: {
      username,
      text: userMessage.text
    }
  };

  if (gameSession && userMessage.isGuess) {
    let result = gameSession.makeGuess(username, userMessage.text);
    response.gameUpdate = result;
    response.userMessage!.guess = result.guessResult;
  }

  sendToAll(response);
};

const onDisconnected = (username: string) => {
  connectedUsers.delete(username);
  gameSession?.removePlayer(username);
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

  // first connection
  if (!gameSession) {
    gameSession = new GameSession();
    gameSession.start(
      (endResult) => {
        sendToAll({ serverMessage: "Round over, restarting in 3s" });
      },
      (initialState) => {
        sendToAll({ gameUpdate: initialState });
      }
    );
  }

  // add player and update scoreboards
  gameSession.addPlayer(username);
  sendToAll({
    serverMessage: `User ${username} connected`,
    gameUpdate: { scores: gameSession.getGameState().scores }
  });

  // add connection, sent initial state
  connectedUsers.set(username, connection);
  connection.send(JSON.stringify({ gameUpdate: gameSession.getGameState() }));

  connection.on("message", (data) => onUserMessage(username, data));
  connection.on("close", () => onDisconnected(username));
};
