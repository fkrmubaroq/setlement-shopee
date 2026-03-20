import { createElement } from "react"
import { cn } from "@/lib/utils"

type TypographyProps = {
    children: React.ReactNode
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'blockquote' | 'large' | 'small' | 'muted'
    className?: string
}

const variants = {
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight text-balance',
    h2: 'scroll-m-2 pb-2 text-3xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    p: 'leading-7',
    blockquote: 'mt-6 border-l-2 pl-6 italic',
    large: "text-lg font-semibold",
    small: "text-sm leading-none font-medium",
    muted: "text-muted-foreground text-sm",
}
export default function Typography({ children, as, className }: TypographyProps) {
    if (as === "large" || as === "small" || as === "muted") {
        return createElement("div", { className: cn(variants[as as keyof typeof variants], className) }, children)
    }
    return createElement(as ?? 'p', { className: cn(variants[as as keyof typeof variants], className) }, children)
}