
export enum Themes {
  DARK = "dark",
  LIGHT = "light",
  SYSTEM = "system",
}

export enum LogLevels {
  ERROR = "error",
  INFO = "info",
  WARNING = "warning",
  SUCCESS = "success",
}

export type Log = {
  time: number;
  message: string;
  logLevel: LogLevels;
}

export type AppContextState = {
  theme: Themes,
  setTheme: (theme: Themes) => void;
  logs: Log[];
  generateLog: (message: string, logLeve: LogLevels) => void;
  clearLogs: () => void;
}