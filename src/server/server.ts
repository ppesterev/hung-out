import { createServer } from "http";
import { WebSocket, WebSocketServer } from "ws";

import serveStaticFiles from "./serve-static-files";
import { ServerDataUpdate, ServerErrorUpdate } from "../shared/types";

interface Player {
  connection: WebSocket;
  score: number;
}

const connectedPlayers = new Map<string, Player>();

const PORT = process.env.PORT || 9001;

const server = createServer((req, res) => {
  return serveStaticFiles(req, res);
});

const wsServer = new WebSocketServer({ server });
wsServer.on("connection", (ws, req) => {
  const reqUrl = new URL(req.url!, `wss://${req.headers.host}`);
  const username = reqUrl.searchParams.get("username");

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
  const message: ServerDataUpdate = {
    userList: Array.from(connectedPlayers.keys())
  };
  ws.send(JSON.stringify(message));

  // add player record
  connectedPlayers.set(username, { connection: ws, score: 0 });

  ws.on("close", () => {
    connectedPlayers.delete(username);
  });

  // notify players of new connection
  connectedPlayers.forEach((player) => {
    let message: ServerDataUpdate = {
      serverMessage: `Player ${username} connected`
    };
    player.connection.send(JSON.stringify(message));
  });
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
