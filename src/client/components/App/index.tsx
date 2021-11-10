import { useState } from "preact/hooks";

import * as api from "../../api";

import WelcomeScreen from "../WelcomeScreen";
import GameScreen from "../GameScreen";

import "./style.css";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  return isConnected ? (
    <GameScreen
      messages={messages}
      onDisconnected={() => {
        setIsConnected(false);
        setMessages([]);
      }}
    />
  ) : (
    <WelcomeScreen
      onConnected={(response) => {
        setIsConnected(true);
        api.onUpdate((update) => {
          setMessages((messages) => messages.concat(JSON.stringify(update)));
        });
      }}
    />
  );
}
