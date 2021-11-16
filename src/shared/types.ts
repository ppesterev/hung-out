type GameResult = "win" | "loss";

export interface GameState {
  partialTerm?: string;
  scores?: { [key: string]: number };
  mistakes?: string[];
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
  };
  userList?: string[];
  gameUpdate?: GameState;
}

export type ServerUpdate = ServerDataUpdate | ServerErrorUpdate;

export interface UserMessage {
  text: string;
  isGuess: boolean;
}
