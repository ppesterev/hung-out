import { Game, GuessResult } from "./hangman-game";
import { words } from "./words";

import { GameUpdate } from "../shared/types";

export class GameSession {
  protected scores: { [key: string]: number } = {};
  protected game: Game;

  protected onEnded: null | ((endResult: GameUpdate) => void) = null;
  protected onRestarted: null | ((initialState: GameUpdate) => void) = null;

  constructor() {
    this.game = new Game(words);
  }

  start(
    onEnded: (result: GameUpdate) => void,
    onRestarted: (initialState: GameUpdate) => void
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

  getGameState(): GameUpdate {
    return {
      partialTerm: this.game.partialTerm,
      mistakes: this.game.mistakes,
      scores: { ...this.scores }
    };
  }

  makeGuess(guesserName: string, guess: string): GameUpdate {
    if (!(guesserName in this.scores)) {
      return {};
    }

    const remainingLetters = this.game.hiddenLetters.size;
    const result = this.game.makeGuess(guess);
    if (result === GuessResult.INVALID) {
      return {};
    }

    const update: GameUpdate = {
      partialTerm: this.game.partialTerm,
      mistakes: this.game.mistakes,
      scores: {}
    };

    switch (result) {
      case GuessResult.HIT:
        this.scores[guesserName]++;
        break;
      case GuessResult.MISS:
        this.scores[guesserName]--;
        break;
      case GuessResult.WIN:
        this.scores[guesserName] += Math.floor(remainingLetters * 1.5);
        update.gameResult = "win";
        break;
      case GuessResult.LOSS:
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
