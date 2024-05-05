import { cn } from "@/lib/utils";
import { FC, HTMLAttributes } from "react";

interface HeadlineOneProps extends HTMLAttributes<HTMLHeadingElement> { }

const HeadlineOne: FC<HeadlineOneProps> = ({ className, children, ...props }) => {
  return <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)} {...props}>{children}</h1>
}

export default HeadlineOne;