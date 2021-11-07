import { Container, WelcomeForm, NameInput } from "./styled";

export default function WelcomeScreen() {
  return (
    <Container>
      <WelcomeForm>
        <label>
          <NameInput type="text" name="username" />
        </label>
        <button type="submit">Join game</button>
      </WelcomeForm>
    </Container>
  );
}
