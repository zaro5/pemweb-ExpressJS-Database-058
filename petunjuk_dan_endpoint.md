# Tugas Pemrograman Web - Week 10
## Express.js REST API with Prisma ORM & Database

### Identitas Mahasiswa
* **Nama**: Azita Zahwa Zahida Asmoro
* **NRP**: 5027251058
* **Mata Kuliah**: Pemrograman Web
* **Topik**: Integrasi Database dengan Prisma ORM pada Express.js

---

## 🛠️ Petunjuk Menjalankan Proyek

### 1. Instalasi Dependensi
Jalankan perintah berikut di terminal:
```bash
npm install
```

### 2. Setup Database & Migrasi Prisma
Proyek ini menggunakan **SQLite** sebagai database lokal yang praktis. Jalankan migrasi Prisma untuk membuat tabel:
```bash
npx prisma migrate dev --name init
```

### 3. Mengisi Data Awal (Seeding 2 Data: Buku & Pulpen)
Untuk memasukkan 2 data awal sesuai ketentuan tugas:
```bash
npm run seed
```

### 4. Menjalankan Server API
Jalankan server Express:
```bash
npm run dev
```
Server akan aktif di `http://localhost:3000`.

### 5. Membuka Prisma Studio (Melihat Database)
Untuk melihat data database secara visual (berguna untuk screenshot *before - after*):
```bash
npm run prisma:studio
```
Buka browser pada alamat `http://localhost:5555`.

---

## 📡 Dokumentasi Endpoint & Skenario Pengujian (Evidence)

Setiap endpoint telah diuji dengan berbagai skenario (sukses, validasi error 400, not found 404).

Validasi input: `name` harus berupa string yang tidak kosong, `price` harus berupa bilangan bulat dari 0 sampai 2147483647, dan ID harus berupa bilangan bulat positif. Input yang tidak valid akan menghasilkan `400 Bad Request`.

### 1. GET /products (Menampilkan Seluruh Data)
* **Method**: `GET`
* **URL**: `http://localhost:3000/products`
* **Deskripsi**: Mengambil seluruh daftar produk yang tersimpan di database.
* **Response Berhasil (200 OK)**:
```json
{
  "status": "success",
  "message": "Berhasil mengambil seluruh data produk",
  "data": [
    {
      "id": 1,
      "name": "Buku",
      "price": 15000,
      "createdAt": "2026-11-16T09:10:25.213Z",
      "updatedAt": "2026-11-16T09:10:25.213Z"
    },
    {
      "id": 2,
      "name": "Pulpen",
      "price": 5000,
      "createdAt": "2026-11-16T09:10:25.221Z",
      "updatedAt": "2026-11-16T09:10:25.221Z"
    }
  ]
}
```

---

### 2. GET /products/:id (Menampilkan Detail Produk Berdasarkan ID)
* **Method**: `GET`
* **URL**: `http://localhost:3000/products/1`
* **Skenario Berhasil (200 OK)**:
```json
{
  "status": "success",
  "message": "Berhasil mengambil detail produk",
  "data": {
    "id": 1,
    "name": "Buku",
    "price": 15000,
    "createdAt": "2026-11-16T09:10:25.213Z",
    "updatedAt": "2026-11-16T09:10:25.213Z"
  }
}
```
* **Skenario ID Tidak Ditemukan (404 Not Found)**:
  * **URL**: `http://localhost:3000/products/999`
  * **Response**:
```json
{
  "status": "error",
  "message": "Produk tidak ditemukan"
}
```
* **Skenario Parameter ID Bukan Angka (400 Bad Request)**:
  * **URL**: `http://localhost:3000/products/abc`
  * **Response**:
```json
{
  "status": "error",
  "message": "ID produk harus berupa angka"
}
```

---

### 3. POST /products (Menambahkan Produk Baru)
* **Method**: `POST`
* **URL**: `http://localhost:3000/products`
* **Headers**: `Content-Type: application/json`

#### A. Skenario Berhasil (201 Created)
* **Request Body**:
```json
{
  "name": "Penggaris",
  "price": 3000
}
```
* **Response**:
```json
{
  "status": "success",
  "message": "Produk berhasil ditambahkan",
  "data": {
    "id": 3,
    "name": "Penggaris",
    "price": 3000,
    "createdAt": "2026-11-16T09:10:26.266Z",
    "updatedAt": "2026-11-16T09:10:26.266Z"
  }
}
```

#### B. Skenario Kesalahan Validasi (400 Bad Request - Field Kosong)
* **Request Body**:
```json
{
  "name": "Penghapus"
}
```
* **Response**:
```json
{
  "status": "error",
  "message": "Nama dan harga produk harus diisi"
}
```

#### C. Skenario Kesalahan Validasi (400 Bad Request - Harga Negatif/Bukan Angka)
* **Request Body**:
```json
{
  "name": "Penghapus",
  "price": -1000
}
```
* **Response**:
```json
{
  "status": "error",
  "message": "Harga produk harus berupa angka valid dan minimal 0"
}
```

---

### 4. PUT /products atau PUT /products/:id (Mengupdate Produk)
* **Method**: `PUT`
* **URL**: `http://localhost:3000/products` atau `http://localhost:3000/products/1`
* **Headers**: `Content-Type: application/json`
* **Catatan**: Body sama dengan POST namun ada tambahan `id`.

#### A. Skenario Berhasil (200 OK)
* **Request Body**:
```json
{
  "id": 1,
  "name": "Buku Tulis",
  "price": 20000
}
```
* **Response**:
```json
{
  "status": "success",
  "message": "Produk berhasil diupdate",
  "data": {
    "id": 1,
    "name": "Buku Tulis",
    "price": 20000,
    "createdAt": "2026-11-16T09:10:25.213Z",
    "updatedAt": "2026-11-16T09:10:26.286Z"
  }
}
```

#### B. Skenario ID Tidak Ditemukan (404 Not Found)
* **Request Body**:
```json
{
  "id": 999,
  "name": "Barang Tidak Ada",
  "price": 50000
}
```
* **Response**:
```json
{
  "status": "error",
  "message": "Produk dengan ID 999 tidak ditemukan"
}
```

#### C. Skenario Kesalahan Validasi (400 Bad Request - ID Kosong)
* **Request Body**:
```json
{
  "name": "Buku Baru",
  "price": 10000
}
```
* **Response**:
```json
{
  "status": "error",
  "message": "ID produk harus disertakan (pada body atau URL parameter)"
}
```

---

### 5. DELETE /products/:id (Menghapus Produk Berdasarkan ID)
* **Method**: `DELETE`
* **URL**: `http://localhost:3000/products/2` (menghapus produk dengan ID 2)

#### A. Skenario Berhasil (200 OK)
* **Response**:
```json
{
  "status": "success",
  "message": "Produk berhasil dihapus",
  "data": {
    "id": 2,
    "name": "Pulpen",
    "price": 5000,
    "createdAt": "2026-11-16T09:10:25.221Z",
    "updatedAt": "2026-11-16T09:10:25.221Z"
  }
}
```

#### B. Skenario ID Tidak Ditemukan (404 Not Found)
* **URL**: `http://localhost:3000/products/999`
* **Response**:
```json
{
  "status": "error",
  "message": "Produk dengan ID 999 tidak ditemukan"
}
```

---

## 📸 Panduan Screenshot Evidence Laporan

### 1. Bukti Database (Before vs After)
Gunakan Prisma Studio (`npm run prisma:studio` -> buka `http://localhost:5555`):
* **Before**: Ambil screenshot tabel `Product` setelah menjalankan `npm run seed`. Terlihat 2 baris data:
  - ID 1: Buku (15000)
  - ID 2: Pulpen (5000)
* **After**: Ambil screenshot tabel `Product` setelah menjalankan operasi POST (tambah Penggaris), PUT (update Buku menjadi Buku Tulis), dan DELETE (hapus Pulpen):
  - ID 1: Buku Tulis (20000) [Ter-update]
  - ID 2: Sudah terhapus [Deleted]
  - ID 3: Penggaris (3000) [New Data]

### 2. Bukti Request & Response (Postman / Bruno / Hoppscotch)
Screenshot setiap skenario berikut di tools API client kamu:
1. `GET /products` (Success 200)
2. `GET /products/1` (Success 200)
3. `GET /products/999` (404 Not Found)
4. `POST /products` (Success 201)
5. `POST /products` (400 Validasi Error - missing price)
6. `PUT /products` (Success 200 - update nama/harga dengan id di body)
7. `PUT /products` (404 Not Found - id tidak ada)
8. `DELETE /products/2` (Success 200)
9. `DELETE /products/999` (404 Not Found)
