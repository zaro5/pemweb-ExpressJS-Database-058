import type { ReactNode } from "react"

const variantStyles = {
    blue: "bg-blue-50 text-blue-700 border-blue-200/80",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-red-50 text-red-700 border-red-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
}

export type BadgeProps = {
    children: ReactNode
    variant?: keyof typeof variantStyles
    className?: string
}

export default function Badge({
    children,
    variant = "blue",
    className = "",
}: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}
        >
            {children}
        </span>
    )
}
