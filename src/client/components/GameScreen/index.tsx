import { useState } from "preact/hooks";

import * as api from "../../api";

interface Props {
  messages: string[];
  onDisconnected: () => void;
}

export default function GameScreen({ messages, onDisconnected }: Props) {
  const [messageText, setMessageText] = useState("");
  return (
    <div className="game-screen">
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
