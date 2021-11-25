import { createRef } from "preact/compat";
import { useState, useLayoutEffect } from "preact/hooks";
import classNames from "classnames";

import * as api from "../../api";

import { Message } from "../../types";

import Button from "../Button";

import "./style.css";

interface Props {
  messages: Message[];
}

export default function Chat({ messages }: Props) {
  const [messageText, setMessageText] = useState("");
  const chatlogRef = createRef<HTMLUListElement>();
  const inputRef = createRef<HTMLInputElement>();

  // scroll to bottom
  useLayoutEffect(() => {
    const element = chatlogRef.current;
    element?.scrollTo({ top: element.scrollHeight - element.clientHeight });
  }, [messages]);

  return (
    <div className="chat">
      <ul className="chat__history" ref={chatlogRef}>
        {messages.map((msg) => {
          const isServer = msg.username === null;
          const isGuess = Boolean(msg.username && msg.guess);

          return (
            <li
              class={classNames("chat__message", {
                "chat__message--server": isServer,
                "chat__message--guess": isGuess
              })}
            >
              {isServer || (
                <span className="chat__sender">{msg.username}: </span>
              )}
              {msg.text}
            </li>
          );
        })}
      </ul>
      <form
        className="chat__form"
        onSubmit={(evt) => {
          evt.preventDefault();
          api.sendMessage({ text: messageText, isGuess: true });
          setMessageText("");
          inputRef.current?.focus();
        }}
      >
        <label class="chat__field">
          Send a message or make a guess
          <input
            type="text"
            name="message"
            autoComplete="off"
            value={messageText}
            onInput={(evt) => setMessageText(evt.currentTarget.value)}
            ref={inputRef}
          />
        </label>
        <Button type="submit" className="chat__btn">
          Send chat message
        </Button>
        <Button type="submit" className="chat__btn">
          Make a guess
        </Button>
      </form>
    </div>
  );
}
