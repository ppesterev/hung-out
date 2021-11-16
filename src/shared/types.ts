export type GuessResult = "invalid" | "hit" | "miss" | "win" | "loss";
type GameResult = "win" | "loss";

export interface GameState {
  partialTerm?: string;
  scores?: { [key: string]: number };
  mistakes?: string[];
  guessResult?: GuessResult;
  gameResult?: GameResult;
}

export interface ServerErrorUpdate {
  error: string;
}

export interface ServerDataUpdate {
  serverMessage?: string;
  userMessage?: {
    username: string;
    text: string;
    guess?: GuessResult;
  };
  userList?: string[];
  gameUpdate?: GameState;
}

export type ServerUpdate = ServerDataUpdate | ServerErrorUpdate;

export interface ClientMessage {
  text: string;
  isGuess: boolean;
}
