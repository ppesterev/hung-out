import { useState } from "preact/hooks";

import * as api from "../../api";

interface Props {
  users: string[];
  messages: string[];
  onDisconnected: () => void;
}

export default function GameScreen({ users, messages, onDisconnected }: Props) {
  const [messageText, setMessageText] = useState("");
  return (
    <div className="game-screen">
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li>{user}</li>
        ))}
      </ul>
      <h2>Chat</h2>
      <ul>
        {messages.map((msg) => (
          <li>{msg}</li>
        ))}
      </ul>
      <form
        className="chat-form"
        onSubmit={(evt) => {
          evt.preventDefault();
          api.sendMessage(messageText);
        }}
      >
        <input
          type="text"
          name="message"
          value={messageText}
          onInput={(evt) => setMessageText(evt.currentTarget.value)}
        />
        <button type="submit">Send</button>
      </form>
      <button
        type="button"
        onClick={() => {
          api.disconnect();
          onDisconnected();
        }}
      >
        Disconnect
      </button>
    </div>
  );
}
