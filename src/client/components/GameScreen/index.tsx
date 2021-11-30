import { useMemo } from "preact/hooks";
import classNames from "classnames";

import { GameState } from "../../../shared/types";
import { Message } from "../../types";
import * as api from "../../api";

import UserInfo from "../UserInfo";
import HangmanGraphic from "../HangmanGraphic";
import MistakeCounter from "../MistakeCounter";
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
  const leaderboardScores = useMemo(() => {
    const scores = gameState.scores || {};
    return Object.keys(scores)
      .sort((a, b) => scores[b] - scores[a])
      .map((name) => ({ name, score: scores[name] }));
  }, [gameState]);

  return (
    <div className="game-screen">
      <div
        className={classNames("game-screen__term", {
          "game-screen__term--won": gameState.gameResult === "win",
          "game-screen__term--lost": gameState.gameResult === "loss"
        })}
      >
        {gameState.partialTerm?.split("").map((letter) => (
          <span className="game-screen__term-letter">{letter}</span>
        ))}
      </div>
      <section className="game-screen__user-info">
        <h2 className="visually-hidden">User info</h2>
        <UserInfo
          name={username}
          score={(gameState.scores || {})[username]}
          onLeave={() => {
            api.disconnect();
            onDisconnected();
          }}
        />
      </section>
      <section className="game-screen__user-list">
        <h2 className="game-screen__heading">Leaderboard</h2>
        <ol className="leaderboard">
          {leaderboardScores.map(({ name, score }) => (
            <li
              className={classNames("leaderboard__entry", {
                "leaderboard__entry--own": username === name
              })}
            >
              {name}: {score}
            </li>
          ))}
        </ol>
      </section>
      <section className="game-screen__chat">
        <h2 className="visually-hidden">Chat</h2>
        <Chat messages={messages} />
      </section>
      <section className="game-screen__game-state">
        <h2 class="visually-hidden">Game state</h2>
        <HangmanGraphic mistakeCount={gameState.mistakes?.length || 0} />
        <MistakeCounter
          className="game-screen__mistakes"
          mistakes={gameState.mistakes || []}
          maxMistakes={7}
        />
      </section>
      <section className="game-screen__instructions">
        <h2 className="visually-hidden">Instructions</h2>
        <p>
          The objective is to guess the word at the top. Send a 1-letter message
          to make a guess. A correct guess is worth 1 point. Making 7 wrong
          guesses loses the round.
        </p>
        <p>
          You can also try to guess the entire word at once for bonus points,
          but getting it wrong immediately loses the round and incurs a points
          penalty.
        </p>
      </section>
    </div>
  );
}
