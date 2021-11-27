import { createRef } from "preact/compat";
import { useLayoutEffect } from "preact/hooks";
import classNames from "classnames";

import { Message } from "../../types";

import ChatForm from "./ChatForm";

import "./style.css";

interface Props {
  messages: Message[];
}

export default function Chat({ messages }: Props) {
  const chatlogRef = createRef<HTMLUListElement>();

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
      <ChatForm className="chat__form" />
    </div>
  );
}
