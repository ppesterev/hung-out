const WS_URL =
  process.env.NODE_ENV === "production"
    ? `wss://${window.location.host}`
    : `ws://localhost:9001`;

let connection: WebSocket | null = null;

export function connect(username: string): Promise<any> {
  return new Promise((resolve, reject) => {
    if (connection) {
      reject("A connection has already been established");
    }

    const url = new URL(`/?username=${username}`, WS_URL);
    connection = new WebSocket(url);

    connection.addEventListener(
      "message",
      (evt) => {
        const response = JSON.parse(evt.data);
        if (response.error) {
          reject(response.error);
          connection = null;
        }
        resolve(response);
      },
      { once: true }
    );
  });
}

export function sendMessage(msg: string) {
  connection?.send(msg);
}

export function onUpdate(handler: (update: Object) => void) {
  connection?.addEventListener("message", (evt) => {
    let update = null;
    try {
      update = JSON.parse(evt.data);
    } catch (err) {
      console.log(err);
      return;
    }
    handler(update);
  });
}
