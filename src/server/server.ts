import { createServer } from "http";
import { WebSocket, WebSocketServer } from "ws";

import serveStaticFiles from "./serve-static-files";

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
    let error = username
      ? "Username is taken"
      : "Connection request must include a username";
    ws.send(JSON.stringify({ error }));
    ws.close();
    return;
  }

  connectedPlayers.set(username, { connection: ws, score: 0 });
  ws.send(JSON.stringify({ data: `Hello, ${username}` }));

  ws.on("close", () => {
    connectedPlayers.delete(username);
  });
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
