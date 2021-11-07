import { useState, useEffect } from "preact/hooks";

import WelcomeScreen from "../WelcomeScreen";

import "./App.css";

export default function App() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((msg) => setMessage(msg.hello));
  }, []);

  return <WelcomeScreen message={message} />;
}
