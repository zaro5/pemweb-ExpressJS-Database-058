import { Link } from "react-router"
import { TbError404, TbHome, TbPackage } from "react-icons/tb"

export default function NotFoundPage() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 text-center shadow-md">
                {/* Visual Icon */}
                <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-6 shadow-2xs border border-amber-100">
                    <TbError404 className="h-12 w-12" aria-hidden="true" />
                </div>

                {/* Status & Title */}
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-slate-100 text-slate-700 mb-3">
                    Error 404
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                    Halaman Tidak Ditemukan
                </h1>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                    Maaf, tautan atau URL yang Anda tuju tidak terdaftar di aplikasi ini.
                    Silakan kembali ke beranda atau telusuri katalog produk.
                </p>

                {/* Links */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                        <TbHome className="h-4 w-4" />
                        <span>Halaman Utama</span>
                    </Link>

                    <Link
                        to="/products"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
                    >
                        <TbPackage className="h-4 w-4" />
                        <span>Daftar Produk</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
