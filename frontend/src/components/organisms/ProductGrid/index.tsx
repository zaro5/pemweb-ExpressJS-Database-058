import type { Product } from "../../../types/product"
import ProductCard from "../../molecules/ProductCard"
import { TbPackageOff, TbPlus } from "react-icons/tb"
import Button from "../../atoms/Button"

export type ProductGridProps = {
    products: Product[]
    isLoading?: boolean
    onSelect?: (id: number) => void
    onEdit?: (product: Product) => void
    onDelete?: (product: Product) => void
    onAddClick?: () => void
}

export default function ProductGrid({
    products,
    isLoading = false,
    onSelect,
    onEdit,
    onDelete,
    onAddClick,
}: ProductGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse flex flex-col justify-between h-56"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-5 w-16 bg-slate-200 rounded-full" />
                                <div className="h-9 w-9 bg-slate-200 rounded-lg" />
                            </div>
                            <div className="h-6 w-3/4 bg-slate-200 rounded-md mb-2" />
                            <div className="h-7 w-1/2 bg-slate-200 rounded-md" />
                        </div>
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <div className="h-8 w-20 bg-slate-200 rounded-md" />
                            <div className="flex gap-2">
                                <div className="h-8 w-14 bg-slate-200 rounded-md" />
                                <div className="h-8 w-14 bg-slate-200 rounded-md" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto my-8">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                    <TbPackageOff className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    Tidak ada produk ditemukan
                </h3>
                <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                    Belum ada produk yang tersedia atau tidak ada produk yang cocok dengan pencarian Anda.
                </p>
                {onAddClick && (
                    <Button
                        variant="primary"
                        onClick={onAddClick}
                        icon={<TbPlus className="h-4 w-4" />}
                    >
                        Tambah Produk Baru
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={onSelect}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}
