import { test, expect } from "@playwright/test"

const mockProducts = [
    { id: 1, name: "Buku Tulis", price: 15000 },
    { id: 2, name: "Pulpen Gel", price: 5000 },
]

test.beforeEach(async ({ page }) => {
    // Intercept backend API requests
    await page.route("**/products", async (route) => {
        if (route.request().method() === "GET") {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                json: {
                    status: "success",
                    message: "Berhasil",
                    data: mockProducts,
                },
            })
        } else {
            await route.continue()
        }
    })

    await page.route("**/products/1", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            json: {
                status: "success",
                message: "Detail",
                data: mockProducts[0],
            },
        })
    })

    await page.route("**/products/999", async (route) => {
        await route.fulfill({
            status: 404,
            contentType: "application/json",
            json: {
                status: "error",
                message: "Produk dengan ID 999 tidak ditemukan",
            },
        })
    })
})

for (const width of [390, 1440]) {
    test(`halaman daftar produk responsif dan menampilkan kartu produk pada ${width}px`, async ({
        page,
    }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.goto("/products")

        await expect(page.locator("article")).toHaveCount(2)
        await expect(
            page.getByRole("heading", { name: "Buku Tulis" }),
        ).toBeVisible()
        await expect(
            page.getByRole("heading", { name: "Pulpen Gel" }),
        ).toBeVisible()

        // Check horizontal overflow
        expect(
            await page.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth,
            ),
        ).toBe(true)
    })
}

test("navigasi dari daftar produk menuju detail produk (/products/:id)", async ({
    page,
}) => {
    await page.goto("/products")
    await expect(page.locator("article")).toHaveCount(2)

    // Click detail button on first product
    await page.locator("article").first().getByRole("link", { name: "Detail" }).click()
    await expect(page).toHaveURL(/\/products\/1$/)
    await expect(page.getByRole("heading", { name: "Buku Tulis" })).toBeVisible()
    await expect(page.getByText("ID Produk: #1")).toBeVisible()

    // Click link kembali ke daftar produk
    await page.getByRole("link", { name: "Kembali ke Daftar Produk" }).click()
    await expect(page).toHaveURL(/\/products$/)
})

test("halaman detail produk menampilkan pesan yang jelas jika produk tidak ditemukan", async ({
    page,
}) => {
    await page.goto("/products/999")
    await expect(
        page.getByRole("heading", { name: "Produk Tidak Ditemukan" }),
    ).toBeVisible()
    await expect(
        page.getByText("Produk dengan ID 999 tidak ditemukan"),
    ).toBeVisible()
    await expect(
        page.getByRole("link", { name: "Kembali ke Daftar Produk" }),
    ).toBeVisible()
})

test("halaman 404 muncul pada URL yang tidak terdaftar dengan tautan kembali", async ({
    page,
}) => {
    await page.goto("/halaman-ngawur-tidak-ada")
    await expect(
        page.getByRole("heading", { name: "Halaman Tidak Ditemukan" }),
    ).toBeVisible()
    await expect(page.getByRole("link", { name: "Halaman Utama" })).toBeVisible()
    await expect(page.getByRole("link", { name: "Daftar Produk" })).toBeVisible()

    // Test navigation back
    await page.getByRole("link", { name: "Daftar Produk" }).click()
    await expect(page).toHaveURL(/\/products$/)
})
