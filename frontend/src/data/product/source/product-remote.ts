import ProductListParam from "../param/product-list-param.ts"

export type ProductRemoteSource = {
    getProductListRemote: (param?: ProductListParam) => Promise<unknown>
    getProductByIdRemote: (id: number) => Promise<unknown>
    createProductRemote: (data: { name: string; price: number }) => Promise<unknown>
    updateProductRemote: (
        id: number,
        data: { name: string; price: number },
    ) => Promise<unknown>
    deleteProductRemote: (id: number) => Promise<unknown>
}

type ProductRemoteOptions = {
    baseUrl?: string
    fetchImpl?: typeof fetch
}

export default function ProductRemote({
    baseUrl = "",
    fetchImpl = fetch,
}: ProductRemoteOptions = {}): ProductRemoteSource {
    function getValidatedBaseUrl(): string {
        if (!baseUrl.trim()) {
            throw new Error(
                "Isi VITE_API_BASE_URL di .env.local terlebih dahulu.",
            )
        }
        return baseUrl.replace(/\/+$/, "")
    }

    async function getProductListRemote(
        param = new ProductListParam(),
    ): Promise<unknown> {
        const base = getValidatedBaseUrl()
        const url = new URL(`${base}/products`)
        if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error("URL API harus menggunakan http atau https.")
        }
        url.search = param.toQueryString()

        const response = await fetchImpl(url, {
            method: "GET",
            headers: { Accept: "application/json" },
        })

        if (!response.ok) {
            throw new Error(`Gagal memuat produk (HTTP ${response.status}).`)
        }

        return response.json()
    }

    async function getProductByIdRemote(id: number): Promise<unknown> {
        const base = getValidatedBaseUrl()
        const url = new URL(`${base}/products/${id}`)
        if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error("URL API harus menggunakan http atau https.")
        }

        const response = await fetchImpl(url, {
            method: "GET",
            headers: { Accept: "application/json" },
        })

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Produk dengan ID ${id} tidak ditemukan.`)
            }
            throw new Error(
                `Gagal memuat detail produk (HTTP ${response.status}).`,
            )
        }

        return response.json()
    }

    async function createProductRemote(data: {
        name: string
        price: number
    }): Promise<unknown> {
        const base = getValidatedBaseUrl()
        const url = new URL(`${base}/products`)
        if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error("URL API harus menggunakan http atau https.")
        }

        const response = await fetchImpl(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errJson = (await response.json().catch(() => null)) as
                | { message?: string }
                | null
            const errMsg =
                errJson?.message ||
                `Gagal menambahkan produk (HTTP ${response.status}).`
            throw new Error(errMsg)
        }

        return response.json()
    }

    async function updateProductRemote(
        id: number,
        data: { name: string; price: number },
    ): Promise<unknown> {
        const base = getValidatedBaseUrl()
        const url = new URL(`${base}/products/${id}`)
        if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error("URL API harus menggunakan http atau https.")
        }

        const response = await fetchImpl(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ id, ...data }),
        })

        if (!response.ok) {
            const errJson = (await response.json().catch(() => null)) as
                | { message?: string }
                | null
            const errMsg =
                errJson?.message ||
                `Gagal mengupdate produk (HTTP ${response.status}).`
            throw new Error(errMsg)
        }

        return response.json()
    }

    async function deleteProductRemote(id: number): Promise<unknown> {
        const base = getValidatedBaseUrl()
        const url = new URL(`${base}/products/${id}`)
        if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error("URL API harus menggunakan http atau https.")
        }

        const response = await fetchImpl(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
            },
        })

        if (!response.ok) {
            const errJson = (await response.json().catch(() => null)) as
                | { message?: string }
                | null
            const errMsg =
                errJson?.message ||
                `Gagal menghapus produk (HTTP ${response.status}).`
            throw new Error(errMsg)
        }

        return response.json()
    }

    return {
        getProductListRemote,
        getProductByIdRemote,
        createProductRemote,
        updateProductRemote,
        deleteProductRemote,
    }
}
