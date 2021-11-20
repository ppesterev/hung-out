import { useState } from "preact/hooks";

import * as api from "../../api";

import { Message } from "../../types";

import "./style.css";

interface Props {
  messages: Message[];
}

export default function Chat({ messages }: Props) {
  const [messageText, setMessageText] = useState("");

  return (
    <div className="chat">
      <ul className="chat__history">
        {messages.map((msg) => {
          const isServer = msg.username === null;

          return (
            <li class={isServer ? "chat__server-message" : "chat__message"}>
              {isServer ? msg.text : `${msg.username}: ${msg.text}`}
            </li>
          );
        })}
      </ul>
      <form
        className="chat__form"
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
        <button type="submit">Send chat message</button>
        <button type="submit">Make a guess</button>
      </form>
    </div>
  );
}
