import ThemeSwitch from "@/components/common/theme-switch";
import { RoutePaths } from "@/utils/routes";
import { SquareDashedMousePointer } from "lucide-react";
import { type FC } from "react";
import { Link } from "react-router-dom";

const Header: FC = () => {

  return (
    <header className="container fixed top-0 z-50 flex h-14 w-full max-w-screen-2xl items-center justify-between border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Link
        to={RoutePaths.LANDING}
        role="button"
        className="relative 
        inline-flex h-10 overflow-hidden 
        rounded-sm p-px focus:outline-none">
        <span className="
          absolute inset-[-1000%] 
          animate-[spin_2s_linear_infinite] 
          bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span className="inline-flex size-full cursor-pointer items-center justify-center rounded-sm bg-gray-950 px-1 text-sm font-medium text-gray-50 backdrop-blur-3xl hover:bg-zinc-900">
          <SquareDashedMousePointer className="h-6 w-8" />
        </span>
      </Link>
      <ThemeSwitch />
    </header>
  )
}

export default Header