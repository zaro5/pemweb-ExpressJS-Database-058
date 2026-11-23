import { TbSearch, TbX } from "react-icons/tb"

export type SearchBarProps = {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    totalCount?: number
}

export default function SearchBar({
    value,
    onChange,
    placeholder = "Cari produk berdasarkan nama...",
    totalCount,
}: SearchBarProps) {
    return (
        <div className="relative flex-1 max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <TbSearch className="h-4 w-4" aria-hidden="true" />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-2xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    title="Hapus pencarian"
                >
                    <TbX className="h-4 w-4" aria-hidden="true" />
                </button>
            )}
            {typeof totalCount === "number" && !value && (
                <span className="absolute inset-y-0 right-3 flex items-center text-xs text-slate-400 pointer-events-none">
                    {totalCount} item
                </span>
            )}
        </div>
    )
}
