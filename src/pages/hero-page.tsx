import { buttonVariants } from "@/components/ui/button";
import { RoutePaths } from "@/lib/routes";
import { FC } from "react";
import { Link } from "react-router-dom";

import lang from "@/config/en-us.json";
import { ArrowRight, SquareMousePointer } from "lucide-react";
import { cn } from "@/lib/utils";
import HeadlineOne from "@/components/typography/headline-one";
import Para from "@/components/typography/para";

const HeroPage: FC = () => {

  return (<article className="grid-center min-h-screen">
    <section className="max-w-4xl text-center">
      <HeadlineOne className="inline-flex animate-text-gradient bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text text-transparent">
        {lang.heroHeadLine}
      </HeadlineOne>
      <Para className="my-8 text-muted-foreground">
        {lang.heroDescription}
      </Para>
      <Link to={RoutePaths.WORKFLOW} className={cn(buttonVariants({ size: "sm" }), "group")}>
        <SquareMousePointer className="mr-1 h-4" />
        {lang.startBuilding}
        <ArrowRight className="ml-1 h-4 transition-all group-hover:translate-x-2" />
      </Link>
    </section>
  </article>)
}

export default HeroPage;