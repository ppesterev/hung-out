import { createRef } from "preact/compat";
import { useState, useEffect } from "preact/hooks";

import classNames from "classnames";

import * as api from "../../../api";

import Button from "../../Button";

import "./style.css";

interface Props {
  className?: string;
}

export default function ChatForm({ className }: Props) {
  const [messageText, setMessageText] = useState("");
  const inputRef = createRef<HTMLInputElement>();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = (text: string, isGuess: boolean) => {
    api.sendMessage({ text, isGuess });
    setMessageText("");
    inputRef.current?.focus();
  };

  return (
    <form
      className={classNames("chat-form", className)}
      onSubmit={(evt) => {
        evt.preventDefault();
      }}
      onKeyPress={(evt) => {
        if (evt.code !== "Enter") {
          return;
        }

        const isGuess = !evt.ctrlKey;
        sendMessage(messageText, isGuess);
      }}
    >
      <label class="chat-form__field">
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
      <Button
        type="button"
        className="chat-form__btn"
        onClick={() => {
          sendMessage(messageText, false);
        }}
      >
        <div className="chat-form__btn-label">
          Send chat message
          <span className="chat-form__btn-hint">(Ctrl + Enter)</span>
        </div>
      </Button>
      <Button
        type="button"
        className="chat-form__btn"
        onClick={() => {
          sendMessage(messageText, true);
        }}
      >
        <div className="chat-form__btn-label">
          Make a guess
          <span className="chat-form__btn-hint">(Enter)</span>
        </div>
      </Button>
    </form>
  );
}
