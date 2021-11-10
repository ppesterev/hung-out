import { useState } from "preact/hooks";
import * as api from "../../api";

import "./style.css";

interface Props {
  onConnected: (response: Object) => any;
}

export default function WelcomeScreen({ onConnected }: Props) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="welcome-screen">
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
        <label>
          <input
            type="text"
            name="username"
            value={username}
            onInput={(evt) => setUsername(evt.currentTarget.value)}
          />
          <button type="submit">Join game</button>
        </label>
      </form>
    </div>
  );
}
