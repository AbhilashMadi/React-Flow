import lang from "@/config/en-us.json";
import { SquareDashedMousePointer } from "lucide-react";
import { type FC } from "react";
import ThemeSwitch from "./theme-switch";

const Header: FC = () => {

  return (
    <header className="container sticky top-0 z-50 flex h-14 w-full max-w-screen-2xl items-center justify-between border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center">
        <div className="grid-center size-10 cursor-pointer rounded-sm border hover:bg-white/15">
          <SquareDashedMousePointer className="h-6 w-8" />
        </div>
        <h1 className="ml-2 font-mono">{lang.workFlow}</h1>
      </div>
      <div>
        <ThemeSwitch />
      </div>
    </header>
  )
}

export default Header