import { Game } from "./hangman-game";
import { words } from "./words";

import { GameState } from "../shared/types";

export class GameSession {
  protected scores: { [key: string]: number } = {};
  protected game: Game;

  protected onEnded: null | ((endResult: GameState) => void) = null;
  protected onRestarted: null | ((initialState: GameState) => void) = null;

  constructor() {
    this.game = new Game(words);
  }

  start(
    onEnded: (result: GameState) => void,
    onRestarted: (initialState: GameState) => void
  ) {
    for (const name in this.scores) {
      this.scores[name] = 0;
    }

    this.onEnded = onEnded;
    this.onRestarted = onRestarted;
    this.game.startGame();
  }

  addPlayer(username: string): boolean {
    if (username in this.scores) {
      return false;
    }

    this.scores[username] = 0;
    return true;
  }

  removePlayer(username: string) {
    delete this.scores[username];
  }

  getGameState(): GameState {
    return {
      partialTerm: this.game.partialTerm,
      mistakes: this.game.mistakes,
      scores: { ...this.scores }
    };
  }

  makeGuess(guesserName: string, guess: string): GameState {
    if (!(guesserName in this.scores)) {
      return {};
    }

    const remainingLetters = this.game.hiddenLetters.size;
    const result = this.game.makeGuess(guess);
    if (result === "invalid") {
      return {};
    }

    const update: GameState = {
      partialTerm: this.game.partialTerm,
      mistakes: this.game.mistakes,
      guessResult: result,
      scores: {}
    };

    switch (result) {
      case "hit":
        this.scores[guesserName]++;
        break;
      case "win":
        this.scores[guesserName] += Math.floor(remainingLetters * 1.5);
        update.gameResult = "win";
        break;
      case "loss":
        update.gameResult = "loss";
    }

    // game ended -- restart
    if (update.gameResult) {
      this.onEnded && this.onEnded(update);
      setTimeout(() => {
        this.game.startGame();
        this.onRestarted && this.onRestarted(this.getGameState());
      }, 3000);
    }
    update.scores![guesserName] = this.scores[guesserName];
    return update;
  }
}
