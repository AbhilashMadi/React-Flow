import { buttonVariants } from "@/components/ui/button";
import { RoutePaths } from "@/utils/routes";
import { FC } from "react";
import { Link } from "react-router-dom";

import lang from "@/config/en-us.json";
import { ArrowRight, SquareMousePointer } from "lucide-react";
import { cn } from "@/lib/utils";

const HeroPage: FC = () => {

  return (<article className="grid-center min-h-screen">
    <section className="max-w-4xl text-center ">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {lang.heroHeadLine}
      </h1>
      <p className="my-8 text-sm leading-snug text-muted-foreground">
        {lang.heroDescription}
      </p>
      <Link to={RoutePaths.WORKFLOW} className={cn(buttonVariants({ size: "sm" }), "group")}>
        <SquareMousePointer className="mr-1 h-4" /> {lang.startBuilding}
        <ArrowRight className="ml-1 h-4 transition-all group-hover:translate-x-2" />
      </Link>
    </section>
  </article>)
}

export default HeroPage;