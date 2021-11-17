import { useState } from "preact/hooks";

import * as api from "../../api";
import { ServerDataUpdate } from "../../../shared/types";

import "./style.css";

interface Props {
  onConnected: (response: ServerDataUpdate) => any;
}

export default function WelcomeScreen({ onConnected }: Props) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="welcome-screen">
      {error && <span class="welcome-screen__error">Error: {error}</span>}
      <form
        className="join-form"
        onSubmit={(evt) => {
          evt.preventDefault();
          api
            .connect(username)
            .then((response) => {
              onConnected(response);
            })
            .catch((error) => {
              setError(error);
            });
        }}
      >
        <label class="join-form__field">
          <span className="join-form__label">Username:</span>
          <input
            class="join-form__input"
            type="text"
            name="username"
            value={username}
            onInput={(evt) => setUsername(evt.currentTarget.value)}
          />
        </label>
        <button type="submit" class="join-form__submit-btn">
          Join game
        </button>
      </form>
    </div>
  );
}
