import lang from "@/config/en-us.json";
import { RoutePaths } from "@/utils/routes";
import { SquareDashedMousePointer } from "lucide-react";
import { type FC } from "react";
import { Link } from "react-router-dom";
import ThemeSwitch from "./theme-switch";

const Header: FC = () => {

  return (
    <header className="container fixed top-0 z-50 flex h-14 w-full max-w-screen-2xl items-center justify-between border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Link to={RoutePaths.LANDING} className="flex items-center">
        <div className="grid-center size-10 cursor-pointer rounded-sm border hover:bg-white/15">
          <SquareDashedMousePointer className="h-6 w-8" />
        </div>
        <h2 className="ml-2 font-mono">{lang.workFlow}</h2>
      </Link>
      <ThemeSwitch />
    </header>
  )
}

export default Header