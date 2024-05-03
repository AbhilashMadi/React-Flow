
export enum Themes {
  DARK = "dark",
  LIGHT = "light",
  SYSTEM = "system",
}

export type AppContextState = {
  theme: Themes,
  setTheme: (theme: Themes) => void;
}