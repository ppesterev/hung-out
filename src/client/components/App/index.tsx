import { useState, useCallback } from "preact/hooks";

import { GameState, ServerDataUpdate } from "../../../shared/types";
import { Message } from "../../types";
import * as api from "../../api";

import WelcomeScreen from "../WelcomeScreen";
import GameScreen from "../GameScreen";

import "./style.css";

export default function App() {
  const [connectedAs, setConnectedAs] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>({});

  const onUpdate = useCallback((update: ServerDataUpdate) => {
    setMessages((messages) =>
      messages
        .concat(
          update.serverMessage
            ? { username: null, text: update.serverMessage }
            : []
        )
        .concat(update.userMessage || [])
    );
    setGameState((state) => ({ ...state, ...update.gameUpdate }));
  }, []);

  const onConnected = useCallback(
    (username: string, response: ServerDataUpdate) => {
      setUsers((users) => response.userList || users);
      setGameState((state) =>
        response.gameUpdate ? { ...state, ...response.gameUpdate } : state
      );
      setConnectedAs(username);
      api.onUpdate(onUpdate);
    },
    []
  );

  const onDisconnected = useCallback(() => {
    setConnectedAs(null);
    setMessages([]);
    setUsers([]);
    setGameState({});
  }, []);

  return connectedAs !== null ? (
    <GameScreen
      username={connectedAs}
      users={users}
      messages={messages}
      gameState={gameState}
      onDisconnected={onDisconnected}
    />
  ) : (
    <WelcomeScreen onConnected={onConnected} />
  );
}
