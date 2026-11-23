import { useState, useEffect, type FormEvent } from "react"
import { TbX, TbPackage } from "react-icons/tb"
import type { Product, ProductValues } from "../../../types/product"
import Button from "../../atoms/Button"
import Input from "../../atoms/Input"

export type ProductFormModalProps = {
    isOpen: boolean
    mode: "create" | "edit"
    initialData?: Product | null
    isSubmitting?: boolean
    onSubmit: (values: ProductValues) => Promise<void> | void
    onClose: () => void
}

type ModalFormInnerProps = {
    mode: "create" | "edit"
    initialData?: Product | null
    isSubmitting: boolean
    onSubmit: (values: ProductValues) => Promise<void> | void
    onClose: () => void
}

function ModalFormInner({
    mode,
    initialData,
    isSubmitting,
    onSubmit,
    onClose,
}: ModalFormInnerProps) {
    const [name, setName] = useState(() => (mode === "edit" && initialData ? initialData.name : ""))
    const [price, setPrice] = useState(() =>
        mode === "edit" && initialData ? String(initialData.price) : "",
    )
    const [errors, setErrors] = useState<{ name?: string; price?: string }>({})

    function validate(): boolean {
        const newErrors: { name?: string; price?: string } = {}

        if (!name.trim()) {
            newErrors.name = "Nama produk wajib diisi"
        }

        const parsedPrice = Number(price)
        if (
            price.trim() === "" ||
            isNaN(parsedPrice) ||
            !Number.isSafeInteger(parsedPrice) ||
            parsedPrice < 0
        ) {
            newErrors.price = "Harga harus berupa angka bulat positif atau 0"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        if (!validate()) return

        await onSubmit({
            name: name.trim(),
            price: Number(price),
        })
    }

    const title = mode === "create" ? "Tambah Produk Baru" : "Edit Produk"
    const submitText = mode === "create" ? "Simpan Produk" : "Perbarui Produk"

    return (
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 transform transition-all">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <TbPackage className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h2 id="form-modal-title" className="text-lg font-bold text-slate-900">
                        {title}
                    </h2>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
                    title="Tutup formulir"
                >
                    <TbX className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <Input
                    label="Nama Produk"
                    placeholder="Contoh: Pensil 2B, Penghapus..."
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                    }}
                    error={errors.name}
                    required
                    disabled={isSubmitting}
                    autoFocus
                />

                <Input
                    label="Harga Produk"
                    type="number"
                    placeholder="Contoh: 15000"
                    prefixText="Rp"
                    value={price}
                    onChange={(e) => {
                        setPrice(e.target.value)
                        if (errors.price) setErrors((prev) => ({ ...prev, price: undefined }))
                    }}
                    error={errors.price}
                    required
                    min="0"
                    step="1"
                    disabled={isSubmitting}
                />

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
                        Batal
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSubmitting}>
                        {submitText}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default function ProductFormModal({
    isOpen,
    mode,
    initialData,
    isSubmitting = false,
    onSubmit,
    onClose,
}: ProductFormModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !isSubmitting) {
                onClose()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, isSubmitting, onClose])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-modal-title"
        >
            <ModalFormInner
                key={`${mode}-${initialData?.id ?? "new"}`}
                mode={mode}
                initialData={initialData}
                isSubmitting={isSubmitting}
                onSubmit={onSubmit}
                onClose={onClose}
            />
        </div>
    )
}
