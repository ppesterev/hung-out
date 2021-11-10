import { WebSocketServer } from "ws";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";

import { addPlayer } from "./user-connections";

export const connectWSServer = (server: HttpServer | HttpsServer) => {
  const wsServer = new WebSocketServer({ server });
  wsServer.on("connection", (ws, req) => {
    const reqUrl = new URL(req.url!, `wss://${req.headers.host}`);
    const username = reqUrl.searchParams.get("username");
    addPlayer(ws, username);
  });
};
