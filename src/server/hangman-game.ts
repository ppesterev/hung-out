const DEFAULT_MISTAKE_LIMIT = 7;

const enum GameState {
  IDLE,
  STARTING,
  GUESSING
}

const enum GuessResult {
  INVALID,
  CORRECT,
  MISTAKE,
  WIN,
  LOSS
}

export class Game {
  protected _state: GameState = GameState.IDLE;
  get state() {
    return this._state;
  }
  protected set state(state) {
    this._state = state;
  }

  protected _guesses: string[] = [];
  get guesses() {
    return this._guesses.slice();
  }
  protected set guesses(guesses) {
    this._guesses = guesses;
  }

  protected _mistakes: string[] = [];
  get mistakes() {
    return this._mistakes.slice();
  }
  protected set mistakes(mistakes) {
    this._mistakes = mistakes;
  }

  protected _maxMistakes: number = DEFAULT_MISTAKE_LIMIT;
  get maxMistakes() {
    return this._maxMistakes;
  }
  protected set maxMistakes(max) {
    this._maxMistakes = max;
  }

  protected _term: string | null = null;
  get term() {
    return this._term;
  }
  protected set term(term) {
    this._term = term;
  }

  protected wordlist: string[];

  protected hiddenLetters = new Set<string>();
  protected get revealedLetters(): Set<string> {
    if (!this.term) {
      return new Set();
    }
    const termLetters = this.term.split("");
    return new Set(
      termLetters.filter((letter) => !this.hiddenLetters.has(letter))
    );
  }

  constructor(wordlist: string[]) {
    this.wordlist = wordlist.slice();
  }

  stopGame() {
    this.state = GameState.IDLE;
  }

  resetGame() {
    this.term = null;
    this.mistakes = [];
    this.guesses = [];
    this.hiddenLetters.clear();
    this.state = GameState.IDLE;
  }

  makeGuess(guess: string): GuessResult {
    if (this.state !== GameState.GUESSING || this.term === null) {
      return GuessResult.INVALID;
    }

    if (this.revealedLetters.has(guess) || this.mistakes.includes(guess)) {
      return GuessResult.INVALID;
    }

    // 1 letter
    if (guess.length === 1) {
      if (this.hiddenLetters.has(guess)) {
        this.hiddenLetters.delete(guess);
        if (this.hiddenLetters.size === 0) {
          this.stopGame();
          return GuessResult.WIN;
        }
        return GuessResult.CORRECT;
      } else {
        this.mistakes.push(guess);
        if (this.mistakes.length >= this.maxMistakes) {
          this.stopGame();
          return GuessResult.LOSS;
        }
        return GuessResult.MISTAKE;
      }
    }
    // full word guess
    else if (guess.length === this.term.length) {
      this.stopGame();
      return guess === this.term ? GuessResult.WIN : GuessResult.LOSS;
    } else return GuessResult.INVALID;
  }
}
