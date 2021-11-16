import { GuessResult } from "../shared/types";

export type UserMessage = {
  username: string;
  text: string;
  guess?: GuessResult;
};

export type ServerMessage = {
  username: null;
  text: string;
};

export type Message = UserMessage | ServerMessage;
