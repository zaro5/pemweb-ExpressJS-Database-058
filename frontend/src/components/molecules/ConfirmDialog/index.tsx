import { useEffect } from "react"
import { TbAlertTriangle } from "react-icons/tb"
import Button from "../../atoms/Button"

export type ConfirmDialogProps = {
    isOpen: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    isLoading?: boolean
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = "Hapus",
    cancelText = "Batal",
    isLoading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !isLoading) {
                onCancel()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, isLoading, onCancel])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-150"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-100 transform transition-all">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <TbAlertTriangle className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                        <h3
                            id="modal-title"
                            className="text-base font-semibold text-slate-900 mb-1"
                        >
                            {title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    )
}
