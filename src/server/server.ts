import { createServer } from "http";
import { WebSocket, WebSocketServer } from "ws";

import serveStaticFiles from "./serve-static-files";

const userConnections: {
  [key: string]: { username: string; connection: WebSocket };
} = {};

const PORT = process.env.PORT || 9001;

const server = createServer((req, res) => {
  return serveStaticFiles(req, res);
});

const wsServer = new WebSocketServer({ server });
wsServer.on("connection", (ws, req) => {
  const reqUrl = new URL(req.url!, `wss://${req.headers.host}`);
  console.log(reqUrl);

  const username = reqUrl.searchParams.get("username");

  let error = null;
  if (!username) {
    error = "Connection request must include a username";
    ws.send(JSON.stringify({ error }));
    ws.close();
    return;
  }

  if (username in userConnections) {
    error = "Username is taken";
    ws.send(JSON.stringify({ error }));
    ws.close();
    return;
  }

  userConnections[username] = {
    username,
    connection: ws
  };

  ws.send(JSON.stringify({ data: `Hello, ${username}` }));
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
