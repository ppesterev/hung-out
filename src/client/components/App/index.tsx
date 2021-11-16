import { useState } from "preact/hooks";

import * as api from "../../api";
import { GameState } from "../../../shared/types";

import WelcomeScreen from "../WelcomeScreen";
import GameScreen from "../GameScreen";

import "./style.css";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>({});

  return isConnected ? (
    <GameScreen
      users={users}
      messages={messages}
      onDisconnected={() => {
        setIsConnected(false);
        setMessages([]);
      }}
    />
  ) : (
    <WelcomeScreen
      onConnected={(response) => {
        setUsers((users) => response.userList || users);
        setIsConnected(true);
        api.onUpdate((update) => {
          setMessages((messages) => messages.concat(JSON.stringify(update)));
        });
      }}
    />
  );
}
