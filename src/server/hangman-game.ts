const DEFAULT_MISTAKE_LIMIT = 7;

const enum GameState {
  IDLE,
  STARTING,
  GUESSING
}

const enum GuessResult {
  INVALID,
  HIT,
  MISS,
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

  protected _term: string = "";
  get term() {
    return this._term;
  }
  protected set term(term) {
    this._term = term;
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

  protected get hiddenLetters(): Set<string> {
    const termLetters = this.term.split("");
    return new Set(
      termLetters.filter((letter) => !this.guesses.includes(letter))
    );
  }

  protected get revealedLetters(): Set<string> {
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

  stopGame() {
    this.state = GameState.IDLE;
  }

  resetGame() {
    this.term = "";
    this.guesses = [];
    this.state = GameState.IDLE;
  }

  makeGuess(guess: string): GuessResult {
    if (this.state !== GameState.GUESSING || this.term === null) {
      return GuessResult.INVALID;
    }

    if (this.revealedLetters.has(guess) || this.mistakes.includes(guess)) {
      return GuessResult.INVALID;
    }

    // one letter
    if (guess.length === 1) {
      const isCorrect = this.hiddenLetters.has(guess);
      this.guesses.push(guess);

      if (this.hiddenLetters.size === 0) {
        this.stopGame();
        return GuessResult.WIN;
      } else if (this.mistakes.length >= this.maxMistakes) {
        this.stopGame();
        return GuessResult.LOSS;
      }
      return isCorrect ? GuessResult.HIT : GuessResult.MISS;
    }

    // full word guess
    if (guess.length === this.term.length) {
      this.stopGame();
      return guess === this.term ? GuessResult.WIN : GuessResult.LOSS;
    }

    // neither
    return GuessResult.INVALID;
  }
}
