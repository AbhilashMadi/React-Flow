import { type FC } from "react";

import { useData } from "@/hooks/state-hooks";
import { Themes } from "@/types/context";
import { Tabs, TabsList, TabsTrigger } from "@ui/tabs";

import { Laptop, Moon, Sun } from "lucide-react";

const ThemeSwitch: FC = () => {
  const { theme, setTheme } = useData();

  return <Tabs defaultValue={theme} onValueChange={(val) => setTheme(val as Themes)}>
    <TabsList className="h-9">
      <TabsTrigger value={Themes.DARK} className="p-2"><Moon size={12} /></TabsTrigger>
      <TabsTrigger value={Themes.LIGHT} className="p-2"><Sun size={12} /></TabsTrigger>
      <TabsTrigger value={Themes.SYSTEM} className="p-2"><Laptop size={12} /></TabsTrigger>
    </TabsList>
  </Tabs>
}

export default ThemeSwitch;