import { useState } from "preact/hooks";

import { GameState } from "../../../shared/types";
import { Message } from "../../types";
import * as api from "../../api";

interface Props {
  users: string[];
  messages: Message[];
  gameState: GameState;
  onDisconnected: () => void;
}

export default function GameScreen({
  users,
  messages,
  gameState,
  onDisconnected
}: Props) {
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
      <h2>Game state</h2>
      <ul>
        <li>Term: {gameState.partialTerm}</li>
        <li>Mistakes: {gameState.mistakes}</li>
      </ul>
      <form
        className="chat-form"
        onSubmit={(evt) => {
          evt.preventDefault();
          api.sendMessage({ text: messageText, isGuess: true });
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
