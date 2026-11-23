import { useState } from "react"
import { NavLink, Link } from "react-router"
import { TbPackage, TbMenu2, TbX, TbPlus } from "react-icons/tb"

export type NavbarProps = {
    onAddProductClick?: () => void
}

export default function Navbar({ onAddProductClick }: NavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const linkClasses = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        }`

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Brand */}
                    <Link
                        to="/"
                        className="flex items-center gap-2.5 font-bold text-slate-900 text-lg hover:text-blue-600 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                            <TbPackage className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <span className="tracking-tight">TokoProduk</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-2">
                        <NavLink to="/" end className={linkClasses}>
                            Beranda
                        </NavLink>
                        <NavLink to="/products" className={linkClasses}>
                            Daftar Produk
                        </NavLink>
                    </nav>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {onAddProductClick ? (
                            <button
                                type="button"
                                onClick={onAddProductClick}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
                            >
                                <TbPlus className="h-4 w-4" aria-hidden="true" />
                                <span>Tambah Produk</span>
                            </button>
                        ) : (
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
                            >
                                <TbPackage className="h-4 w-4" aria-hidden="true" />
                                <span>Kelola Produk</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
                            aria-label="Toggle navigation menu"
                        >
                            {isMobileMenuOpen ? (
                                <TbX className="h-6 w-6" />
                            ) : (
                                <TbMenu2 className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2">
                    <NavLink
                        to="/"
                        end
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={linkClasses}
                    >
                        <div className="w-full">Beranda</div>
                    </NavLink>
                    <NavLink
                        to="/products"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={linkClasses}
                    >
                        <div className="w-full">Daftar Produk</div>
                    </NavLink>
                    {onAddProductClick && (
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsMobileMenuOpen(false)
                                    onAddProductClick()
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
                            >
                                <TbPlus className="h-4 w-4" />
                                <span>Tambah Produk</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    )
}
