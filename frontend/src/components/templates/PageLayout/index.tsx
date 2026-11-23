import { Outlet } from "react-router"
import Navbar from "../../organisms/Navbar"
import Footer from "../../organisms/Footer"

export default function PageLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
            <Navbar />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
