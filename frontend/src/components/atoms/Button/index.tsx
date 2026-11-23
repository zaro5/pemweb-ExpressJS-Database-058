import type { ButtonHTMLAttributes, ReactNode } from "react"
import { TbLoader2 } from "react-icons/tb"

const variantStyles = {
    primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border border-transparent shadow-sm",
    secondary:
        "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-300 focus:ring-slate-400 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-transparent shadow-sm",
    subtleDanger:
        "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 focus:ring-red-400",
    outline:
        "bg-transparent text-blue-600 hover:bg-blue-50 border border-blue-600 focus:ring-blue-400",
    success:
        "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 border border-transparent shadow-sm",
}

const sizeStyles = {
    sm: "px-2.5 py-1.5 text-xs font-medium rounded-md gap-1.5",
    md: "px-4 py-2 text-sm font-medium rounded-lg gap-2",
    lg: "px-5 py-2.5 text-base font-medium rounded-lg gap-2.5",
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: keyof typeof variantStyles
    size?: keyof typeof sizeStyles
    isLoading?: boolean
    icon?: ReactNode
}

export default function Button({
    variant = "primary",
    size = "md",
    isLoading = false,
    icon,
    disabled = false,
    className = "",
    type = "button",
    children,
    ...props
}: ButtonProps) {
    const baseStyle =
        "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {isLoading ? (
                <TbLoader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
                icon
            )}
            <span>{children}</span>
        </button>
    )
}
