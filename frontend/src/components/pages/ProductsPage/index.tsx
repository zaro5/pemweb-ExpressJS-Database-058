import { useState, useEffect, useMemo } from "react"
import { TbPlus, TbRefresh, TbPackage } from "react-icons/tb"
import type { Product, ProductValues } from "../../../types/product"
import ProductRemote from "../../../data/product/source/product-remote.ts"
import ProductRepository from "../../../data/product/repository/product-repository.ts"
import ProductGrid from "../../organisms/ProductGrid"
import ProductFormModal from "../../organisms/ProductFormModal"
import ConfirmDialog from "../../molecules/ConfirmDialog"
import SearchBar from "../../molecules/SearchBar"
import Alert from "../../molecules/Alert"
import Button from "../../atoms/Button"

const repository = ProductRepository(
    ProductRemote({ baseUrl: import.meta.env.VITE_API_BASE_URL ?? "" }),
)

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    // Modals state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Alert feedback
    const [alert, setAlert] = useState<{
        type: "success" | "error" | "info"
        message: string
    } | null>(null)

    // Initial load without synchronous setState in effect
    useEffect(() => {
        let ignore = false
        repository
            .getProductList()
            .then((models) => {
                if (!ignore) {
                    setProducts(models.map((m) => m.toJSON()))
                    setIsLoading(false)
                }
            })
            .catch((error) => {
                if (!ignore) {
                    setAlert({
                        type: "error",
                        message:
                            error instanceof Error
                                ? error.message
                                : "Gagal memuat data produk dari server.",
                    })
                    setIsLoading(false)
                }
            })
        return () => {
            ignore = true
        }
    }, [])

    async function handleRefresh() {
        setIsLoading(true)
        try {
            const models = await repository.getProductList()
            setProducts(models.map((m) => m.toJSON()))
        } catch (error) {
            setAlert({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Gagal memuat data produk dari server.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Filter products based on search input
    const filteredProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()
        if (!query) return products
        return products.filter((p) => p.name.toLowerCase().includes(query))
    }, [products, searchQuery])

    // Create product
    async function handleCreateProduct(values: ProductValues) {
        setIsSubmitting(true)
        try {
            const created = await repository.createProduct(values)
            setProducts((prev) => [...prev, created.toJSON()])
            setIsAddModalOpen(false)
            setAlert({
                type: "success",
                message: `Produk "${created.getName()}" berhasil ditambahkan ke database!`,
            })
        } catch (error) {
            setAlert({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Gagal menambahkan produk.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Update product
    async function handleUpdateProduct(values: ProductValues) {
        if (!editingProduct) return
        setIsSubmitting(true)
        try {
            const updated = await repository.updateProduct(
                editingProduct.id,
                values,
            )
            setProducts((prev) =>
                prev.map((p) =>
                    p.id === editingProduct.id ? updated.toJSON() : p,
                ),
            )
            setEditingProduct(null)
            setAlert({
                type: "success",
                message: `Produk "${updated.getName()}" berhasil diperbarui!`,
            })
        } catch (error) {
            setAlert({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Gagal memperbarui produk.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Delete product
    async function handleDeleteProduct() {
        if (!deletingProduct) return
        setIsSubmitting(true)
        try {
            await repository.deleteProduct(deletingProduct.id)
            setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id))
            setAlert({
                type: "success",
                message: `Produk "${deletingProduct.name}" berhasil dihapus dari database!`,
            })
            setDeletingProduct(null)
        } catch (error) {
            setAlert({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Gagal menghapus produk.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <TbPackage className="h-7 w-7 text-blue-600" />
                        <span>Daftar & Pengelolaan Produk</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Kelola data inventaris produk secara realtime melalui Express REST API
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <Button
                        variant="secondary"
                        onClick={handleRefresh}
                        isLoading={isLoading}
                        icon={<TbRefresh className="h-4 w-4" />}
                        title="Muat ulang dari API"
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => setIsAddModalOpen(true)}
                        icon={<TbPlus className="h-4 w-4" />}
                    >
                        Tambah Produk
                    </Button>
                </div>
            </div>

            {/* Notification Alert */}
            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}

            {/* Toolbar: Search & Info */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Cari produk berdasarkan nama..."
                    totalCount={products.length}
                />
                <div className="text-xs font-medium text-slate-500 text-right">
                    Menampilkan{" "}
                    <span className="font-semibold text-slate-800">
                        {filteredProducts.length}
                    </span>{" "}
                    dari {products.length} produk
                </div>
            </div>

            {/* Product Grid */}
            <section aria-label="Daftar Produk" aria-busy={isLoading}>
                <ProductGrid
                    products={filteredProducts}
                    isLoading={isLoading}
                    onEdit={(product) => setEditingProduct(product)}
                    onDelete={(product) => setDeletingProduct(product)}
                    onAddClick={() => setIsAddModalOpen(true)}
                />
            </section>

            {/* Modal: Tambah Produk */}
            <ProductFormModal
                isOpen={isAddModalOpen}
                mode="create"
                isSubmitting={isSubmitting}
                onSubmit={handleCreateProduct}
                onClose={() => setIsAddModalOpen(false)}
            />

            {/* Modal: Edit Produk */}
            <ProductFormModal
                isOpen={editingProduct !== null}
                mode="edit"
                initialData={editingProduct}
                isSubmitting={isSubmitting}
                onSubmit={handleUpdateProduct}
                onClose={() => setEditingProduct(null)}
            />

            {/* Modal: Konfirmasi Hapus */}
            <ConfirmDialog
                isOpen={deletingProduct !== null}
                title="Konfirmasi Hapus Produk"
                message={`Apakah Anda yakin ingin menghapus produk "${deletingProduct?.name}" (ID #${deletingProduct?.id})? Data akan dihapus secara permanen dari database.`}
                confirmText="Hapus Sekarang"
                cancelText="Batalkan"
                isLoading={isSubmitting}
                onConfirm={handleDeleteProduct}
                onCancel={() => setDeletingProduct(null)}
            />
        </div>
    )
}
