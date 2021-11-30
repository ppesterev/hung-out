import { GuessResult } from "../shared/types";

const DEFAULT_MISTAKE_LIMIT = 7;

const enum GameState {
  IDLE = "IDLE",
  GUESSING = "GUESSING",
  ENDED = "ENDED"
}

export class Game {
  protected _state: GameState = GameState.IDLE;
  get state() {
    return this._state;
  }
  protected set state(state) {
    this._state = state;
  }

  protected _term: string = "";
  get term() {
    return this._term;
  }
  protected set term(term) {
    this._term = term;
  }

  get partialTerm(): string {
    if (this.state === GameState.ENDED) {
      return this.term;
    }

    return this.term
      .split("")
      .map((letter) => (this.revealedLetters.has(letter) ? letter : "_"))
      .join("");
  }

  protected _guesses: string[] = [];
  get guesses() {
    return this._guesses.slice();
  }
  protected set guesses(guesses) {
    this._guesses = guesses;
  }

  get mistakes(): string[] {
    const termLetters = this.term.split("");
    return this.guesses.filter((guess) => !termLetters.includes(guess));
  }

  get hiddenLetters(): Set<string> {
    const termLetters = this.term.split("");
    return new Set(
      termLetters.filter((letter) => !this.guesses.includes(letter))
    );
  }

  get revealedLetters(): Set<string> {
    const termLetters = this.term.split("");
    return new Set(
      termLetters.filter((letter) => this.guesses.includes(letter))
    );
  }

  protected _maxMistakes: number = DEFAULT_MISTAKE_LIMIT;
  get maxMistakes() {
    return this._maxMistakes;
  }
  protected set maxMistakes(max) {
    this._maxMistakes = max;
  }

  protected wordlist: string[];

  constructor(wordlist: string[]) {
    this.wordlist = wordlist.slice();
  }

  startGame() {
    this.term = this.wordlist[Math.floor(Math.random() * this.wordlist.length)];
    this.guesses = [];
    this.state = GameState.GUESSING;
  }

  makeGuess(guess: string): GuessResult {
    if (this.state !== GameState.GUESSING || this.term === null) {
      return "invalid";
    }

    if (this.revealedLetters.has(guess) || this.mistakes.includes(guess)) {
      return "invalid";
    }

    if (guess.length === 1) {
      const isCorrect = this.hiddenLetters.has(guess);
      this._guesses.push(guess);

      if (this.hiddenLetters.size === 0) {
        this.state = GameState.ENDED;
        return "win";
      } else if (this.mistakes.length >= this.maxMistakes) {
        this.state = GameState.ENDED;
        return "loss";
      }
      return isCorrect ? "hit" : "miss";
    }

    if (guess.length === this.term.length) {
      this.state = GameState.ENDED;
      return guess === this.term ? "instant-win" : "instant-loss";
    }

    return "invalid";
  }
}
