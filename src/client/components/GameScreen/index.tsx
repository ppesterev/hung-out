import { useState, useEffect } from "preact/hooks";
import { default as merge } from "deepmerge";

import { GameState } from "../../../shared/types";
import { Message } from "../../types";
import * as api from "../../api";

import HangmanGraphic from "../HangmanGraphic";
import Chat from "../Chat";

import "./style.css";

interface Props {
  username: string;
  messages: Message[];
  gameState: GameState;
  onDisconnected: () => void;
}

export default function GameScreen({
  username,
  messages,
  gameState,
  onDisconnected
}: Props) {
  // extract scores from gameState
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  useEffect(() => {
    setScores((scores) => merge(scores, gameState.scores || {}));
  }, [username, gameState]);

  return (
    <div className="game-screen">
      <span className="game-screen__term">{gameState.partialTerm}</span>
      <section className="game-screen__user-info">
        <h2 class="game-screen__info-title">Playing as {username}</h2>
        <span class="game-screen__score">
          Current score: {scores[username]}
        </span>
        <button
          class="game-screen__leave-btn"
          type="button"
          onClick={() => {
            api.disconnect();
            onDisconnected();
          }}
        >
          Leave
        </button>
      </section>
      <section className="game-screen__user-list">
        <h2>Leaderboard</h2>
        <ul>
          {Object.keys(scores).map((name) => (
            <li>
              {name}: {scores[name]}
            </li>
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
    </div>
  );
}
