import { test } from "node:test"
import assert from "node:assert/strict"
import ProductModel from "../src/data/product/model/product-model.ts"
import ProductListParam from "../src/data/product/param/product-list-param.ts"
import ProductRemote from "../src/data/product/source/product-remote.ts"
import ProductRepository from "../src/data/product/repository/product-repository.ts"

const sample = { id: 1, name: " Pulpen ", price: 5000 }

test("model memetakan response ke produk UI tanpa field tambahan", () => {
    const model = ProductModel.fromResponse({ ...sample, extra: "ignored" })
    assert.equal(model.getId(), 1)
    assert.equal(model.getName(), "Pulpen")
    assert.equal(model.getPrice(), 5000)
    assert.deepEqual(model.toJSON(), { id: 1, name: "Pulpen", price: 5000 })
})

test("model menolak data API yang melanggar kontrak produk", () => {
    for (const data of [
        null,
        {},
        { ...sample, id: 0 },
        { ...sample, name: " " },
        { ...sample, price: "5000" },
        { ...sample, price: -1 },
        { ...sample, price: 1.5 },
        { ...sample, price: Infinity },
    ]) {
        assert.throws(() => ProductModel.fromResponse(data), TypeError)
    }
})

test("parameter query di-encode dan query kosong dihilangkan", () => {
    assert.equal(new ProductListParam().toQueryString(), "")
    const query = new ProductListParam({
        query: " Buku & Pulpen ",
    }).toQueryString()
    assert.equal(new URLSearchParams(query).get("q"), "Buku & Pulpen")
})

test("pipeline source → repository → model memakai satu GET yang dikonfigurasi", async () => {
    let calls = 0
    const source = ProductRemote({
        baseUrl: "https://api.example.test/api/",
        fetchImpl: async (url, options) => {
            calls++
            assert.ok(url instanceof URL)
            assert.equal(
                url.href,
                "https://api.example.test/api/products?q=pul",
            )
            assert.equal(options?.method, "GET")
            assert.equal(
                new Headers(options?.headers).get("Accept"),
                "application/json",
            )
            return Response.json([sample])
        },
    })
    const repository = ProductRepository(source)
    const models = await repository.getProductList(
        new ProductListParam({ query: "pul" }),
    )
    assert.equal(calls, 1)
    assert.ok(models[0] instanceof ProductModel)
    assert.equal(models[0].getName(), "Pulpen")
})

test("tanpa URL API tidak ada request HTTP", async () => {
    let called = false
    const source = ProductRemote({
        fetchImpl: async () => {
            called = true
            return new Response()
        },
    })
    await assert.rejects(source.getProductListRemote(), /VITE_API_BASE_URL/)
    assert.equal(called, false)
})

test("source menolak HTTP error dan JSON yang tidak valid", async () => {
    const cases: [Response, RegExp | typeof SyntaxError][] = [
        [new Response("error", { status: 500 }), /HTTP 500/],
        [new Response("not-json"), SyntaxError],
    ]
    for (const [response, expected] of cases) {
        const source = ProductRemote({
            baseUrl: "https://api.example.test",
            fetchImpl: async () => response,
        })
        await assert.rejects(source.getProductListRemote(), expected)
    }
})

test("repository menerima array kosong dan response berbalut { data: [...] }", async () => {
    const empty = ProductRepository({
        getProductListRemote: async () => [],
        getProductByIdRemote: async () => ({}),
        createProductRemote: async () => ({}),
        updateProductRemote: async () => ({}),
        deleteProductRemote: async () => ({}),
    })
    assert.deepEqual(await empty.getProductList(), [])

    const wrapped = ProductRepository({
        getProductListRemote: async () => ({ data: [sample] }),
        getProductByIdRemote: async () => ({}),
        createProductRemote: async () => ({}),
        updateProductRemote: async () => ({}),
        deleteProductRemote: async () => ({}),
    })
    const list = await wrapped.getProductList()
    assert.equal(list.length, 1)
    assert.equal(list[0].getName(), "Pulpen")
})

test("repository menolak ID duplikat dan format tidak valid", async () => {
    const invalidFormats = [
        "not an array or object",
        12345,
        null,
        { invalidKey: [] },
    ]
    for (const invalid of invalidFormats) {
        const repo = ProductRepository({
            getProductListRemote: async () => invalid,
            getProductByIdRemote: async () => ({}),
            createProductRemote: async () => ({}),
            updateProductRemote: async () => ({}),
            deleteProductRemote: async () => ({}),
        })
        await assert.rejects(repo.getProductList(), TypeError)
    }

    const duplicateRepo = ProductRepository({
        getProductListRemote: async () => [sample, sample],
        getProductByIdRemote: async () => ({}),
        createProductRemote: async () => ({}),
        updateProductRemote: async () => ({}),
        deleteProductRemote: async () => ({}),
    })
    await assert.rejects(duplicateRepo.getProductList(), TypeError)
})
