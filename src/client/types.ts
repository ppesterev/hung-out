type UserChat = {
  isGuess: false;
};

type UserGuess = {
  isGuess: true;
  isCorrect: boolean;
};

export type UserMessage = (UserChat | UserGuess) & {
  username: string;
  text: string;
};

export type ServerMessage = {
  text: string;
};

export type Message = UserMessage | ServerMessage;
