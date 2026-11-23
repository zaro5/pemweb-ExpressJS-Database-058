import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router"
import {
    TbArrowLeft,
    TbPackage,
    TbCalendar,
    TbClock,
    TbEdit,
    TbTrash,
    TbAlertCircle,
    TbCheck,
} from "react-icons/tb"
import type { Product, ProductValues } from "../../../types/product"
import ProductRemote from "../../../data/product/source/product-remote.ts"
import ProductRepository from "../../../data/product/repository/product-repository.ts"
import { formatRupiah } from "../../../utils/formatRupiah"
import Badge from "../../atoms/Badge"
import Button from "../../atoms/Button"
import ProductFormModal from "../../organisms/ProductFormModal"
import ConfirmDialog from "../../molecules/ConfirmDialog"
import Alert from "../../molecules/Alert"

const repository = ProductRepository(
    ProductRemote({ baseUrl: import.meta.env.VITE_API_BASE_URL ?? "" }),
)

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const parsedId = Number(id)
    const isInvalidId = !id || isNaN(parsedId) || !Number.isSafeInteger(parsedId) || parsedId <= 0

    const [product, setProduct] = useState<Product | null>(null)
    const [isLoading, setIsLoading] = useState(!isInvalidId)
    const [fetchError, setFetchError] = useState<string | null>(null)

    // Modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [alert, setAlert] = useState<{
        type: "success" | "error" | "info"
        message: string
    } | null>(null)

    useEffect(() => {
        if (isInvalidId) return

        let ignore = false
        repository
            .getProductById(parsedId)
            .then((model) => {
                if (!ignore) {
                    setProduct(model.toJSON())
                    setIsLoading(false)
                }
            })
            .catch((err) => {
                if (!ignore) {
                    setFetchError(
                        err instanceof Error
                            ? err.message
                            : `Produk dengan ID #${parsedId} tidak ditemukan.`,
                    )
                    setIsLoading(false)
                }
            })

        return () => {
            ignore = true
        }
    }, [isInvalidId, parsedId])

    // Update handler
    async function handleUpdate(values: ProductValues) {
        if (!product) return
        setIsSubmitting(true)
        try {
            const updated = await repository.updateProduct(product.id, values)
            setProduct(updated.toJSON())
            setIsEditModalOpen(false)
            setAlert({
                type: "success",
                message: "Data produk berhasil diperbarui!",
            })
        } catch (err) {
            setAlert({
                type: "error",
                message:
                    err instanceof Error
                        ? err.message
                        : "Gagal memperbarui produk.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Delete handler
    async function handleDelete() {
        if (!product) return
        setIsSubmitting(true)
        try {
            await repository.deleteProduct(product.id)
            navigate("/products")
        } catch (err) {
            setAlert({
                type: "error",
                message:
                    err instanceof Error
                        ? err.message
                        : "Gagal menghapus produk.",
            })
            setIsSubmitting(false)
            setIsConfirmDeleteOpen(false)
        }
    }

    function formatDate(dateStr?: string) {
        if (!dateStr) return null
        try {
            return new Intl.DateTimeFormat("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
            }).format(new Date(dateStr))
        } catch {
            return dateStr
        }
    }

    // 1. Invalid ID or Not Found State (Ketentuan 02: Jika produk tidak ditemukan, tampilkan pesan yang jelas)
    if (isInvalidId || fetchError) {
        return (
            <div className="max-w-2xl mx-auto py-12">
                <div className="bg-white rounded-2xl border border-red-200/80 p-8 sm:p-12 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-5">
                        <TbAlertCircle className="h-9 w-9" aria-hidden="true" />
                    </div>
                    <Badge variant="red" className="mb-3">
                        Status 404 · Not Found
                    </Badge>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        Produk Tidak Ditemukan
                    </h1>
                    <p className="text-sm text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                        {isInvalidId
                            ? `ID produk "${id}" tidak valid. Harap gunakan parameter angka bulat positif.`
                            : fetchError ||
                              `Produk dengan parameter ID "${id}" tidak terdaftar di database backend kami.`}
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
                    >
                        <TbArrowLeft className="h-4 w-4" />
                        <span>Kembali ke Daftar Produk</span>
                    </Link>
                </div>
            </div>
        )
    }

    // 2. Loading State
    if (isLoading || !product) {
        return (
            <div className="max-w-3xl mx-auto py-8 space-y-6">
                <div className="h-6 w-40 bg-slate-200 rounded-md animate-pulse" />
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs animate-pulse space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="h-6 w-24 bg-slate-200 rounded-full" />
                        <div className="h-12 w-12 bg-slate-200 rounded-xl" />
                    </div>
                    <div className="h-8 w-2/3 bg-slate-200 rounded-md" />
                    <div className="h-10 w-1/3 bg-slate-200 rounded-md" />
                    <div className="pt-6 border-t border-slate-100 flex gap-3">
                        <div className="h-10 w-24 bg-slate-200 rounded-lg" />
                        <div className="h-10 w-24 bg-slate-200 rounded-lg" />
                    </div>
                </div>
            </div>
        )
    }

    // 3. Found State
    return (
        <div className="max-w-3xl mx-auto py-4 space-y-6">
            {/* Back Button */}
            <div className="flex items-center justify-between">
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors group"
                >
                    <TbArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Kembali ke Daftar Produk</span>
                </Link>
                <Badge variant="green" className="gap-1">
                    <TbCheck className="h-3 w-3" />
                    <span>Tersimpan di API</span>
                </Badge>
            </div>

            {/* Notification alert */}
            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}

            {/* Detail Card */}
            <article className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-10 space-y-8">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-100">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge variant="blue">ID Produk: #{product.id}</Badge>
                            <span className="text-xs text-slate-400">· Prisma SQLite</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            {product.name}
                        </h1>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <TbPackage className="h-8 w-8" aria-hidden="true" />
                    </div>
                </div>

                {/* Price Display */}
                <div className="bg-gradient-to-r from-blue-50/60 to-slate-50 p-6 rounded-2xl border border-blue-100/60">
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                        Harga Produk
                    </p>
                    <p className="text-3xl sm:text-4xl font-black text-slate-900">
                        {formatRupiah(product.price)}
                    </p>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                            <TbCalendar className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Tanggal Dibuat</p>
                            <p className="text-sm font-semibold text-slate-800">
                                {formatDate(product.createdAt) || "Waktu awal pembuatan"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                            <TbClock className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Terakhir Diupdate</p>
                            <p className="text-sm font-semibold text-slate-800">
                                {formatDate(product.updatedAt) || "Belum pernah diupdate"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                        <TbArrowLeft className="h-4 w-4" />
                        <span>Ke Semua Produk</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setIsEditModalOpen(true)}
                            icon={<TbEdit className="h-4 w-4" />}
                        >
                            Edit Data
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => setIsConfirmDeleteOpen(true)}
                            icon={<TbTrash className="h-4 w-4" />}
                        >
                            Hapus Produk
                        </Button>
                    </div>
                </div>
            </article>

            {/* Modal Edit */}
            <ProductFormModal
                isOpen={isEditModalOpen}
                mode="edit"
                initialData={product}
                isSubmitting={isSubmitting}
                onSubmit={handleUpdate}
                onClose={() => setIsEditModalOpen(false)}
            />

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={isConfirmDeleteOpen}
                title="Hapus Produk Ini?"
                message={`Anda akan menghapus "${product.name}" (ID #${product.id}) secara permanen dari server database.`}
                confirmText="Ya, Hapus"
                cancelText="Batal"
                isLoading={isSubmitting}
                onConfirm={handleDelete}
                onCancel={() => setIsConfirmDeleteOpen(false)}
            />
        </div>
    )
}
