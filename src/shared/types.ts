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
}

export type ServerUpdate = ServerDataUpdate | ServerErrorUpdate;
