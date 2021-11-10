import { useState } from "preact/hooks";

import "./style.css";

const WS_URL =
  process.env.NODE_ENV === "production"
    ? `wss://${window.location.host}`
    : `ws://localhost:9001`;

export default function WelcomeScreen() {
  const [username, setUsername] = useState("");
  const [messageList, setMessageList] = useState<string[]>([]);

  return (
    <div className="welcome-screen">
      <form
        className="join-form"
        onSubmit={(evt) => {
          evt.preventDefault();
          const url = new URL(`/?username=${username}`, WS_URL);
          const ws = new WebSocket(url);
          ws.addEventListener("message", (evt) => {
            setMessageList((list) => list.concat(evt.data));
          });
        }}
      >
        <label>
          <input
            type="text"
            name="username"
            value={username}
            onInput={(evt) => setUsername(evt.currentTarget.value)}
          />
          <button type="submit">Join game</button>
        </label>
      </form>

      <ul>
        {messageList.map((msg) => (
          <li>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
