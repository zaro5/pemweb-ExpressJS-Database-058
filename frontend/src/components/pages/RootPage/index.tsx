import { useEffect, useState } from "react"
import { Link } from "react-router"
import {
    TbPackage,
    TbArrowRight,
    TbDatabase,
    TbRoute,
    TbPalette,
    TbChecklist,
    TbRefresh,
} from "react-icons/tb"
import ProductRemote from "../../../data/product/source/product-remote.ts"
import ProductRepository from "../../../data/product/repository/product-repository.ts"
import Badge from "../../atoms/Badge"

const repository = ProductRepository(
    ProductRemote({ baseUrl: import.meta.env.VITE_API_BASE_URL ?? "" }),
)

export default function RootPage() {
    const [productCount, setProductCount] = useState<number | null>(null)
    const [isApiOnline, setIsApiOnline] = useState<boolean | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    async function checkApi() {
        setIsLoading(true)
        try {
            const list = await repository.getProductList()
            setProductCount(list.length)
            setIsApiOnline(true)
        } catch {
            setIsApiOnline(false)
            setProductCount(null)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        let ignore = false
        repository
            .getProductList()
            .then((list) => {
                if (!ignore) {
                    setProductCount(list.length)
                    setIsApiOnline(true)
                    setIsLoading(false)
                }
            })
            .catch(() => {
                if (!ignore) {
                    setIsApiOnline(false)
                    setProductCount(null)
                    setIsLoading(false)
                }
            })
        return () => {
            ignore = true
        }
    }, [])

    return (
        <div className="space-y-12 py-4">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-3xl space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/15 text-blue-200">
                        <TbDatabase className="h-3.5 w-3.5 text-blue-400" />
                        <span>Tugas 4 · Pemrograman Web Week 13</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-balance">
                        Sistem Manajemen Produk Berbasis React & Express
                    </h1>

                    <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                        Aplikasi katalog produk modern dengan penerapan React Router,
                        Tailwind CSS, Atomic Design architecture, dan integrasi penuh ke
                        database backend melalui REST API.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 group"
                        >
                            <TbPackage className="h-5 w-5" />
                            <span>Buka Daftar Produk</span>
                            <TbArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <button
                            type="button"
                            onClick={checkApi}
                            disabled={isLoading}
                            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-medium border border-white/10 transition-colors cursor-pointer text-sm"
                        >
                            <TbRefresh
                                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                            />
                            <span>Cek Koneksi API</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Live Status Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Status Backend API
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            {isLoading ? (
                                <span className="text-sm font-medium text-slate-500">
                                    Memeriksa...
                                </span>
                            ) : isApiOnline ? (
                                <>
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-base font-bold text-emerald-700">
                                        Terhubung (Online)
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                    <span className="text-base font-bold text-amber-700">
                                        Offline / Standby
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                    <Badge variant={isApiOnline ? "green" : "amber"}>
                        {isApiOnline ? "Port 3000" : "Periksa Server"}
                    </Badge>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Jumlah Produk Database
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                            {isLoading
                                ? "..."
                                : productCount !== null
                                  ? `${productCount} Produk`
                                  : "0 Produk"}
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <TbPackage className="h-6 w-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Arsitektur UI
                        </p>
                        <p className="text-base font-bold text-slate-900">
                            Atomic Design + Tailwind
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <TbPalette className="h-6 w-6" />
                    </div>
                </div>
            </section>

            {/* Feature Checklist */}
            <section className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">
                        Cakupan Fitur Tugas 4
                    </h2>
                    <p className="text-sm text-slate-500">
                        Seluruh ketentuan fitur telah terintegrasi dan siap diuji:
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                            <TbChecklist className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 text-sm">
                                01 · Pengelolaan Produk (CRUD API)
                            </h3>
                            <p className="text-xs text-slate-600 mt-1">
                                Tambah, lihat daftar, edit, dan hapus produk terhubung
                                langsung dengan database Express + Prisma SQLite.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                            <TbRoute className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 text-sm">
                                02 · Halaman Detail Produk (/products/:id)
                            </h3>
                            <p className="text-xs text-slate-600 mt-1">
                                Navigasi dinamis dengan parameter ID, info lengkap, tombol
                                kembali, dan penanganan ID tidak ditemukan.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            <TbRoute className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 text-sm">
                                03 · Halaman Not Found 404
                            </h3>
                            <p className="text-xs text-slate-600 mt-1">
                                Menangani URL yang tidak terdaftar dengan visual yang ramah
                                dan navigasi kembali ke Beranda atau Produk.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <TbPalette className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 text-sm">
                                04 · Styling Tailwind CSS & Atomic Design
                            </h3>
                            <p className="text-xs text-slate-600 mt-1">
                                Komponen tersusun secara hierarkis (Atoms, Molecules,
                                Organisms, Templates, Pages) dengan desain responsif.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-2 flex justify-end">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        <span>Mulai kelola produk sekarang</span>
                        <TbArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </div>
    )
}
