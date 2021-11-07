export default function WelcomeScreen() {
  return (
    <div className="welcome-screen">
      <form className="join-form">
        <label>
          <input type="text" name="username" />
          <button type="submit">Join game</button>
        </label>
      </form>
    </div>
  );
}
