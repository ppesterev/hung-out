import { GameState } from "../../../shared/types";
import { Message } from "../../types";
import * as api from "../../api";

import HangmanGraphic from "../HangmanGraphic";
import Chat from "../Chat";

import "./style.css";

interface Props {
  username: string;
  users: string[];
  messages: Message[];
  gameState: GameState;
  onDisconnected: () => void;
}

export default function GameScreen({
  username,
  users,
  messages,
  gameState,
  onDisconnected
}: Props) {
  return (
    <div className="game-screen">
      <span className="game-screen__term">{gameState.partialTerm}</span>
      <section className="game-screen__user-list">
        <h2 class="visually-hidden">Users</h2>
        <ul>
          {users.map((user) => (
            <li>{user}</li>
          ))}
        </ul>
      </section>
      <section className="game-screen__chat">
        <h2 className="visually-hidden">Chat</h2>
        <Chat messages={messages} />
      </section>
      <section className="game-screen__game-state">
        <h2 class="visually-hidden">Game state</h2>
        <span>Mistakes: {gameState.mistakes}</span>
        <HangmanGraphic mistakeCount={gameState.mistakes?.length || 0} />
      </section>

      <button
        class="game-screen__leave-btn"
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
