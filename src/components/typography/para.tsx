import { cn } from "@/lib/utils";
import { FC, HTMLAttributes } from "react";

interface IParaProps extends HTMLAttributes<HTMLParagraphElement> { }

const Para: FC<IParaProps> = ({ className, children, ...props }) => {
  return <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props}>{children}</p>
}

export default Para;