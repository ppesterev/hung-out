import { createServer } from "http";
import { WebSocket, WebSocketServer } from "ws";

import serveStaticFiles from "./serve-static-files";
import {
  ServerDataUpdate,
  ServerErrorUpdate,
  ServerUpdate
} from "../shared/types";

interface Player {
  connection: WebSocket;
  score: number;
}

const connectedPlayers = new Map<string, Player>();
const sendToAll = (message: ServerUpdate) => {
  connectedPlayers.forEach(({ connection }) => {
    connection.send(JSON.stringify(message));
  });
};

// const sendToAllExcept = (excludedUser: string, message: ServerUpdate) => {
//   connectedPlayers.forEach(({ connection }, username) => {
//     if (username !== excludedUser) {
//       connection.send(message);
//     }
//   });
// };

const PORT = process.env.PORT || 9001;

const server = createServer((req, res) => {
  return serveStaticFiles(req, res);
});

const wsServer = new WebSocketServer({ server });
wsServer.on("connection", (ws, req) => {
  const reqUrl = new URL(req.url!, `wss://${req.headers.host}`);
  const username = reqUrl.searchParams.get("username");

  // immediately close connection if username is invalid or taken
  if (!username || connectedPlayers.has(username)) {
    const message: ServerErrorUpdate = {
      error: username
        ? "Username is taken"
        : "Connection request must include a username"
    };
    ws.send(JSON.stringify(message));
    ws.close();
    return;
  }

  // the first message a new connection receives
  // signals whether it is accepted or rejected
  const initialMessage: ServerDataUpdate = {
    userList: Array.from(connectedPlayers.keys())
  };
  ws.send(JSON.stringify(initialMessage));

  // add player record
  connectedPlayers.set(username, { connection: ws, score: 0 });
  sendToAll({ serverMessage: `Player ${username} connected` });

  ws.on("message", (data) => {
    sendToAll({
      userMessage: {
        username,
        text: data.toString()
      }
    });
  });

  // handle disconnection
  ws.on("close", () => {
    connectedPlayers.delete(username);
    sendToAll({ serverMessage: `Player ${username} disconnected` });
  });
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
