import { LocalStorageKeys } from "@/lib/storage-keys";
import { Log, LogLevels, Themes, type AppContextState } from "@/types/context";
import { createContext, useCallback, useEffect, useState, type FC, type ReactNode } from "react";

export const appContext = createContext<AppContextState>({
  theme: Themes.SYSTEM,
  setTheme: () => null,
  logs: [],
  generateLog: () => null,
  clearLogs: () => null,
});

interface IAppContextProps {
  children: ReactNode;
}

const AppContext: FC<IAppContextProps> = ({ children }) => {
  const [theme, updateTheme] = useState<Themes>((localStorage.getItem(LocalStorageKeys.APP_THEME) as Themes) ?? Themes.SYSTEM);
  const [logs, setLogs] = useState<Log[]>([]);

  const setTheme = useCallback((theme: Themes) => {
    localStorage.setItem(LocalStorageKeys.APP_THEME, theme);
    updateTheme(theme);
  }, []);

  const generateLog = (message: string, logLevel: LogLevels = LogLevels.INFO): void => {
    setLogs((preLogs) => [...preLogs, {
      time: Date.now(),
      message,
      logLevel
    }])
  }

  const clearLogs = (): void => {
    setLogs([]);
  }

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove(Themes.LIGHT, Themes.DARK)

    if (theme === Themes.SYSTEM) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? Themes.DARK
        : Themes.LIGHT

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  return (<appContext.Provider value={{
    theme,
    setTheme,
    logs,
    generateLog,
    clearLogs,
  }}>
    {children}
  </appContext.Provider>)
}

export default AppContext