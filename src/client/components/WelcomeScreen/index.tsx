import { Container, WelcomeForm, NameInput } from "./styled";

export default function WelcomeScreen() {
  return (
    <Container>
      <h1>Welcome to Hungout</h1>
      <p>It's just a game of Hangman.</p>
      <WelcomeForm>
        <label>
          <NameInput type="text" name="username" />
        </label>
        <button type="submit">Join game</button>
      </WelcomeForm>
    </Container>
  );
}
