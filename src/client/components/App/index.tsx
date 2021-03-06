import { useState, useCallback } from "preact/hooks";
import { default as merge, Options } from "deepmerge";

import { GameState, ServerDataUpdate } from "../../../shared/types";
import { Message } from "../../types";
import * as api from "../../api";

import WelcomeScreen from "../WelcomeScreen";
import GameScreen from "../GameScreen";

import "./style.css";

// new mistakes array overwrites old one
const gameUpdateMergeOpts: Options = {
  arrayMerge: (dest, source, opt) => source
};

export default function App() {
  const [connectedAs, setConnectedAs] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [gameState, setGameState] = useState<GameState>({});

  const onUpdate = useCallback((update: ServerDataUpdate) => {
    setMessages((messages) =>
      messages
        .concat(update.userMessage || [])
        .concat(
          update.serverMessage
            ? { username: null, text: update.serverMessage }
            : []
        )
    );
    setGameState((state) => {
      if (update.gameUpdate && !update.gameUpdate.gameResult) {
        delete state.gameResult;
      }
      return merge(state, update.gameUpdate || {}, gameUpdateMergeOpts);
    });
  }, []);

  const onConnected = useCallback(
    (username: string, response: ServerDataUpdate) => {
      setGameState((state) =>
        response.gameUpdate
          ? merge(state, response.gameUpdate, gameUpdateMergeOpts)
          : state
      );
      setConnectedAs(username);
      api.onUpdate(onUpdate);
    },
    []
  );

  const onDisconnected = useCallback(() => {
    setConnectedAs(null);
    setMessages([]);
    setGameState({});
  }, []);

  return connectedAs !== null ? (
    <GameScreen
      username={connectedAs}
      messages={messages}
      gameState={gameState}
      onDisconnected={onDisconnected}
    />
  ) : (
    <WelcomeScreen onConnected={onConnected} />
  );
}
