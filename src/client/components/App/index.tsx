import { useState } from "preact/hooks";

import * as api from "../../api";

import WelcomeScreen from "../WelcomeScreen";

import "./style.css";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  return isConnected ? (
    <>
      <ul>
        {messages.map((msg) => (
          <li>{msg}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => {
          api.disconnect();
          setIsConnected(false);
          setMessages([]);
        }}
      >
        Disconnect
      </button>
    </>
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
