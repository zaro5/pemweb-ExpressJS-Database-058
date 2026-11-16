const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(express.json());

// 1. GET /products: Menampilkan seluruh data
app.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' }
    });

    res.json({
      status: 'success',
      message: 'Berhasil mengambil seluruh data produk',
      data: products
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data produk',
      error: error.message
    });
  }
});

// 2. GET /products/:id: Menampilkan data produk berdasarkan ID
app.get('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'ID produk harus berupa angka'
      });
    }

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Produk tidak ditemukan'
      });
    }

    res.json({
      status: 'success',
      message: 'Berhasil mengambil detail produk',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil detail produk',
      error: error.message
    });
  }
});

// 3. POST /products: Membuat data baru
app.post('/products', async (req, res) => {
  try {
    const { name, price } = req.body;

    // Validasi input
    if (!name || price === undefined || price === null || price === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Nama dan harga produk harus diisi'
      });
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Harga produk harus berupa angka valid dan minimal 0'
      });
    }

    const newProduct = await prisma.product.create({
      data: {
        name: String(name).trim(),
        price: parsedPrice
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Produk berhasil ditambahkan',
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal menambahkan produk',
      error: error.message
    });
  }
});

// Handler untuk PUT (update data)
async function handleUpdateProduct(req, res) {
  try {
    const rawId = req.body.id || req.params.id;

    if (!rawId) {
      return res.status(400).json({
        status: 'error',
        message: 'ID produk harus disertakan (pada body atau URL parameter)'
      });
    }

    const id = parseInt(rawId);
    if (isNaN(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'ID produk harus berupa angka yang valid'
      });
    }

    const { name, price } = req.body;

    if (!name || price === undefined || price === null || price === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Nama dan harga produk harus diisi'
      });
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Harga produk harus berupa angka valid dan minimal 0'
      });
    }

    // Cek keberadaan produk
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({
        status: 'error',
        message: `Produk dengan ID ${id} tidak ditemukan`
      });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: String(name).trim(),
        price: parsedPrice
      }
    });

    res.json({
      status: 'success',
      message: 'Produk berhasil diupdate',
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengupdate produk',
      error: error.message
    });
  }
}

// 4. PUT: Mengupdate data yang sudah ada
// Mendukung PUT /products (dengan id di body) maupun PUT /products/:id (dengan id di URL/body)
app.put('/products', handleUpdateProduct);
app.put('/products/:id', handleUpdateProduct);

// Handler untuk DELETE (hapus data)
async function handleDeleteProduct(req, res) {
  try {
    const rawId = req.params.id || req.body.id;

    if (!rawId) {
      return res.status(400).json({
        status: 'error',
        message: 'ID produk harus disertakan'
      });
    }

    const id = parseInt(rawId);
    if (isNaN(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'ID produk harus berupa angka yang valid'
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({
        status: 'error',
        message: `Produk dengan ID ${id} tidak ditemukan`
      });
    }

    const deletedProduct = await prisma.product.delete({
      where: { id }
    });

    res.json({
      status: 'success',
      message: 'Produk berhasil dihapus',
      data: deletedProduct
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal menghapus produk',
      error: error.message
    });
  }
}

// 5. DELETE: Menghapus data yang sudah ada (berdasarkan id)
app.delete('/products/:id', handleDeleteProduct);
app.delete('/products', handleDeleteProduct);

// Jalankan Server
const server = app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

// Penanganan graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  server.close();
});
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  server.close();
});
