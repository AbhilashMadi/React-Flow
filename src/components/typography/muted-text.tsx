import { cn } from "@/lib/utils"
import { FC, HTMLAttributes } from "react"

interface IMutedTextProps extends HTMLAttributes<HTMLParagraphElement> { }

const MutedText: FC<IMutedTextProps> = ({ className, children, ...props }) => {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props}>{children}</p>
}

export default MutedText;