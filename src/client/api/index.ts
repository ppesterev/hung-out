import {
  ServerDataUpdate,
  ServerUpdate,
  UserMessage
} from "../../shared/types";

const WS_URL =
  process.env.NODE_ENV === "production"
    ? `wss://${window.location.host}`
    : `ws://localhost:9001`;

let connection: WebSocket | null = null;

export function connect(username: string): Promise<ServerDataUpdate> {
  return new Promise((resolve, reject) => {
    if (connection) {
      reject("A connection has already been established");
    }

    const url = new URL(`/?username=${username}`, WS_URL);
    connection = new WebSocket(url);

    connection.addEventListener(
      "message",
      (evt) => {
        const response = JSON.parse(evt.data) as ServerUpdate;
        if ("error" in response) {
          reject(response.error);
          connection = null;
        } else {
          resolve(response);
        }
      },
      { once: true }
    );
  });
}

export function sendMessage(msg: UserMessage) {
  connection?.send(JSON.stringify(msg));
}

export function onUpdate(handler: (update: ServerDataUpdate) => void) {
  connection?.addEventListener("message", (evt) => {
    let update = null;
    try {
      update = JSON.parse(evt.data) as ServerDataUpdate;
    } catch (err) {
      console.log(err);
      return;
    }
    handler(update);
  });
}

export function disconnect() {
  connection?.close();
  connection = null;
}
