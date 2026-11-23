import type { ProductRemoteSource } from "../source/product-remote.ts"
import ProductModel from "../model/product-model.ts"
import ProductListParam from "../param/product-list-param.ts"

// Maps remote payloads into validated application models.
export default function ProductRepository(source: ProductRemoteSource) {
    async function getProductList(
        param = new ProductListParam(),
    ): Promise<ProductModel[]> {
        const response = await source.getProductListRemote(param)

        let items: unknown[]
        if (Array.isArray(response)) {
            items = response
        } else if (
            typeof response === "object" &&
            response !== null &&
            "data" in response &&
            Array.isArray((response as Record<string, unknown>).data)
        ) {
            items = (response as Record<string, unknown>).data as unknown[]
        } else {
            throw new TypeError(
                "Response API harus berupa array produk atau objek pembungkus dengan data array.",
            )
        }

        const products = items.map((item) => ProductModel.fromResponse(item))
        const ids = products.map((product) => product.getId())
        if (new Set(ids).size !== ids.length) {
            throw new TypeError("ID produk dari API harus unik.")
        }

        return products
    }

    async function getProductById(id: number): Promise<ProductModel> {
        const response = await source.getProductByIdRemote(id)
        let item: unknown = response
        if (
            typeof response === "object" &&
            response !== null &&
            "data" in response
        ) {
            item = (response as Record<string, unknown>).data
        }
        return ProductModel.fromResponse(item)
    }

    async function createProduct(data: {
        name: string
        price: number
    }): Promise<ProductModel> {
        const response = await source.createProductRemote(data)
        let item: unknown = response
        if (
            typeof response === "object" &&
            response !== null &&
            "data" in response
        ) {
            item = (response as Record<string, unknown>).data
        }
        return ProductModel.fromResponse(item)
    }

    async function updateProduct(
        id: number,
        data: { name: string; price: number },
    ): Promise<ProductModel> {
        const response = await source.updateProductRemote(id, data)
        let item: unknown = response
        if (
            typeof response === "object" &&
            response !== null &&
            "data" in response
        ) {
            item = (response as Record<string, unknown>).data
        }
        return ProductModel.fromResponse(item)
    }

    async function deleteProduct(id: number): Promise<ProductModel> {
        const response = await source.deleteProductRemote(id)
        let item: unknown = response
        if (
            typeof response === "object" &&
            response !== null &&
            "data" in response
        ) {
            item = (response as Record<string, unknown>).data
        }
        return ProductModel.fromResponse(item)
    }

    return {
        getProductList,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
    }
}
