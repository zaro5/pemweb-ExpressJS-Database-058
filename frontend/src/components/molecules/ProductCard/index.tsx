import type { Product } from "../../../types/product"
import { Link } from "react-router"
import { TbPackage, TbEye, TbEdit, TbTrash } from "react-icons/tb"
import Badge from "../../atoms/Badge"
import Button from "../../atoms/Button"
import { formatRupiah } from "../../../utils/formatRupiah"

export type ProductCardProps = {
    product: Product
    onSelect?: (id: number) => void
    onEdit?: (product: Product) => void
    onDelete?: (product: Product) => void
}

export default function ProductCard({
    product,
    onSelect,
    onEdit,
    onDelete,
}: ProductCardProps) {
    return (
        <article className="group bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 p-5 flex flex-col justify-between">
            <div>
                {/* Header: ID Badge & Icon */}
                <div className="flex items-center justify-between mb-3">
                    <Badge variant="blue">ID: #{product.id}</Badge>
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                        <TbPackage className="h-5 w-5" aria-hidden="true" />
                    </div>
                </div>

                {/* Name */}
                <h3 className="font-semibold text-slate-800 text-lg mb-1.5 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {product.name}
                </h3>

                {/* Price */}
                <p className="text-xl font-bold text-slate-900 mb-4">
                    {formatRupiah(product.price)}
                </p>
            </div>

            {/* Actions: Detail, Edit, Delete */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                    to={`/products/${product.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                    title="Lihat detail produk"
                >
                    <TbEye className="h-4 w-4" aria-hidden="true" />
                    <span>Detail</span>
                </Link>

                <div className="flex items-center gap-1.5">
                    {onEdit && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onEdit(product)}
                            icon={<TbEdit className="h-3.5 w-3.5" />}
                            title="Edit produk"
                        >
                            Edit
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            variant="subtleDanger"
                            size="sm"
                            onClick={() => onDelete(product)}
                            icon={<TbTrash className="h-3.5 w-3.5" />}
                            title="Hapus produk"
                        >
                            Hapus
                        </Button>
                    )}
                    {onSelect && !onEdit && !onDelete && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onSelect(product.id)}
                        >
                            Pilih produk
                        </Button>
                    )}
                </div>
            </div>
        </article>
    )
}
