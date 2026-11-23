const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(cors());
app.use(express.json());

function parseProductId(value) {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return null;
  }

  if (typeof value === 'string' && !/^\d+$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 && id <= 2147483647 ? id : null;
}

function validateProductInput(body = {}) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return {
      error: 'Nama dan harga produk harus diisi'
    };
  }

  const { name, price } = body;

  if (
    typeof name !== 'string' ||
    name.trim() === '' ||
    price === undefined ||
    price === null ||
    price === '' ||
    (typeof price === 'string' && price.trim() === '')
  ) {
    return {
      error: 'Nama dan harga produk harus diisi'
    };
  }

  const parsedPrice = Number(price);
  if (!Number.isSafeInteger(parsedPrice) || parsedPrice < 0 || parsedPrice > 2147483647) {
    return {
      error: 'Harga produk harus berupa angka valid dan minimal 0'
    };
  }

  return {
    data: {
      name: name.trim(),
      price: parsedPrice
    }
  };
}

// 1. GET /products: Menampilkan seluruh data
app.get(['/products', '/api/products'], async (req, res) => {
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
app.get(['/products/:id', '/api/products/:id'], async (req, res) => {
  try {
    const id = parseProductId(req.params.id);
    if (id === null) {
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
app.post(['/products', '/api/products'], async (req, res) => {
  try {
    const validation = validateProductInput(req.body);
    if (validation.error) {
      return res.status(400).json({
        status: 'error',
        message: validation.error
      });
    }

    const newProduct = await prisma.product.create({
      data: validation.data
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
    const rawId = req.params.id || (req.body && req.body.id);

    if (rawId === undefined || rawId === null || rawId === '') {
      return res.status(400).json({
        status: 'error',
        message: 'ID produk harus disertakan (pada body atau URL parameter)'
      });
    }

    const id = parseProductId(rawId);
    if (id === null) {
      return res.status(400).json({
        status: 'error',
        message: 'ID produk harus berupa angka yang valid'
      });
    }

    const validation = validateProductInput(req.body);
    if (validation.error) {
      return res.status(400).json({
        status: 'error',
        message: validation.error
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
      data: validation.data
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
app.put(['/products', '/api/products'], handleUpdateProduct);
app.put(['/products/:id', '/api/products/:id'], handleUpdateProduct);

// Handler untuk DELETE (hapus data)
async function handleDeleteProduct(req, res) {
  try {
    const rawId = req.params.id || (req.body && req.body.id);

    if (rawId === undefined || rawId === null || rawId === '') {
      return res.status(400).json({
        status: 'error',
        message: 'ID produk harus disertakan'
      });
    }

    const id = parseProductId(rawId);
    if (id === null) {
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
app.delete(['/products/:id', '/api/products/:id'], handleDeleteProduct);
app.delete(['/products', '/api/products'], handleDeleteProduct);

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
