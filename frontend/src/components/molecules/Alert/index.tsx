import { TbCheck, TbAlertCircle, TbInfoCircle, TbX } from "react-icons/tb"

const variantStyles = {
    success: {
        wrapper: "bg-emerald-50 border-emerald-200 text-emerald-800",
        icon: <TbCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />,
    },
    error: {
        wrapper: "bg-red-50 border-red-200 text-red-800",
        icon: (
            <TbAlertCircle className="h-5 w-5 text-red-600" aria-hidden="true" />
        ),
    },
    info: {
        wrapper: "bg-blue-50 border-blue-200 text-blue-800",
        icon: <TbInfoCircle className="h-5 w-5 text-blue-600" aria-hidden="true" />,
    },
}

export type AlertProps = {
    type?: "success" | "error" | "info"
    message: string
    onClose?: () => void
    className?: string
}

export default function Alert({
    type = "info",
    message,
    onClose,
    className = "",
}: AlertProps) {
    if (!message) return null

    const config = variantStyles[type]

    return (
        <div
            role="alert"
            className={`flex items-center justify-between p-4 rounded-xl border text-sm font-medium transition-all ${config.wrapper} ${className}`}
        >
            <div className="flex items-center gap-3">
                <span className="shrink-0">{config.icon}</span>
                <span>{message}</span>
            </div>
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="ml-auto -mr-1 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-black/5 cursor-pointer"
                    title="Tutup pesan"
                >
                    <TbX className="h-4 w-4" aria-hidden="true" />
                </button>
            )}
        </div>
    )
}
