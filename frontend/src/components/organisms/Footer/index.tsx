export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 mt-auto py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <div>
                        <p className="text-sm font-semibold text-slate-800">
                            Praktikum Pemrograman Web · Tugas 4 (Week 13)
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Implementasi React Router, Tailwind CSS, & Integrasi API Backend
                        </p>
                    </div>
                    <div className="text-xs text-slate-500 sm:text-right">
                        <p className="font-medium text-slate-700">
                            Azita Zahwa Zahida Asmoro
                        </p>
                        <p className="text-slate-400">NRP: 5027251058</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
