import type { InputHTMLAttributes, ReactNode } from "react"

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string
    error?: string
    helperText?: string
    prefixText?: string
    icon?: ReactNode
}

export default function Input({
    label,
    error,
    helperText,
    prefixText,
    icon,
    id,
    disabled = false,
    className = "",
    ...props
}: InputProps) {
    const inputId = id || props.name

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                    {label} {props.required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative rounded-lg shadow-sm">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        {icon}
                    </div>
                )}
                {prefixText && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-medium text-sm">
                        {prefixText}
                    </div>
                )}
                <input
                    id={inputId}
                    disabled={disabled}
                    className={`block w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
                        icon ? "pl-10" : ""
                    } ${prefixText ? "pl-11" : ""} ${
                        error
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                    } ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
            {!error && helperText && (
                <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
            )}
        </div>
    )
}
