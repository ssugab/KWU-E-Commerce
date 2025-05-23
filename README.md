# KWU-E-Commerce

## Dokumentasi Setup Aplikasi

### Persyaratan Sistem
- Node.js (versi 16 atau lebih tinggi)
- NPM (versi 8 atau lebih tinggi)
- MongoDB (lokal atau atlas)

### 1. Clone Repository

```bash
git clone https://github.com/ssugab/KWU-E-Commerce.git
cd KWU-E-Commerce
```

### 2. Setup Backend

#### Instalasi Dependency
```bash
cd backend
npm install
```

#### Konfigurasi Environment Variables
Buat file `.env` di direktori backend dengan isi sebagai berikut:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017 # Sesuaikan dengan MongoDB URL Anda
JWT_SECRET=rahasiajwtkamu # Ganti dengan kunci rahasia Anda
CLOUDINARY_CLOUD_NAME=namacloud
CLOUDINARY_API_KEY=apikey
CLOUDINARY_API_SECRET=apisecret
```

#### Menjalankan Backend
```bash
# Menjalankan server dengan nodemon (disarankan untuk pengembangan)
npm run server

# Atau menjalankan server tanpa nodemon
npm start
```

### 3. Setup Frontend

#### Instalasi Dependency
```bash
cd frontend
npm install
```

#### Menjalankan Frontend
```bash
npm run dev
```
Frontend akan berjalan di `http://localhost:5173` secara default.

### 4. Database Setup

#### 4.1. Setup MongoDB Atlas (Cloud)

1. **Membuat Akun MongoDB Atlas**
   - Kunjungi [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Klik "Try Free" dan daftar dengan email Anda
   - Isi formulir pendaftaran dan verifikasi email Anda

2. **Membuat Cluster**
   - Pilih opsi "Shared" (gratis) untuk development
   - Pilih cloud provider (AWS, Google Cloud, atau Azure) dan region terdekat
   - Klik "Create Cluster" (proses pembuatan membutuhkan waktu beberapa menit)

3. **Konfigurasi Keamanan**
   - Di menu sidebar, klik "Database Access"
   - Klik "Add New Database User"
   - Buat username dan password (catat password dengan baik)
   - Pilih "Read and Write to Any Database" untuk hak akses
   - Klik "Add User"

4. **Mengatur Akses Jaringan**
   - Di menu sidebar, klik "Network Access"
   - Klik "Add IP Address"
   - Untuk development, Anda bisa memilih "Allow Access From Anywhere" (0.0.0.0/0)
   - Untuk production, tambahkan hanya IP server Anda
   - Klik "Confirm"

5. **Mendapatkan Connection String**
   - Kembali ke dashboard "Clusters"
   - Klik "Connect" pada cluster Anda
   - Pilih "Connect your application"
   - Pilih "Node.js" dan versi driver yang sesuai
   - Salin connection string yang muncul
   - Ganti `<password>` dengan password user database Anda
   - Tambahkan nama database di akhir URI (contoh: `mongodb+srv://username:password@cluster0.abcde.mongodb.net/ecommerce`)

6. **Konfigurasi .env**
   - Tambahkan URI connection string ke file `.env` di backend:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.abcde.mongodb.net
   ```

#### 4.2. Setup MongoDB Lokal

1. **Instalasi MongoDB Community Edition**
   - Kunjungi [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Pilih versi, platform (OS), dan package, lalu unduh
   - Ikuti petunjuk instalasi sesuai OS Anda:
     - **Windows**: Jalankan installer dan ikuti wizard instalasi
     - **macOS**: Gunakan Homebrew dengan `brew install mongodb-community`
     - **Linux**: Ikuti instruksi untuk distro Linux Anda

2. **Menjalankan MongoDB Server**
   - **Windows**: Service MongoDB akan berjalan otomatis setelah instalasi
   - **macOS/Linux**: Jalankan `mongod` di terminal

3. **Membuat Database dan User**
   - Buka terminal dan jalankan `mongosh` untuk masuk ke MongoDB shell
   - Buat database dengan perintah: `use ecommerce`
   - Buat user admin:
   ```
   db.createUser({
     user: "adminuser",
     pwd: "password",
     roles: [{ role: "readWrite", db: "ecommerce" }]
   })
   ```

4. **Konfigurasi .env untuk MongoDB Lokal**
   - Edit file `.env` di backend:
   ```
   MONGODB_URI=mongodb://adminuser:password@localhost:27017
   ```

MongoDB akan otomatis diinisialisasi saat server dijalankan. Pastikan server MongoDB berjalan sebelum menjalankan aplikasi.

#### 4.3. Mengisi Data Awal (Opsional)
Untuk mengisi database dengan data awal:
```bash
cd backend
node seed.js
```

### 5. Endpoint API

Backend menyediakan endpoint berikut:
- `GET /api/catalog` - Mendapatkan daftar produk
- `GET /api/user` - Mendapatkan daftar pengguna (memerlukan autentikasi)

### 6. Struktur Direktori

```
KWU-E-Commerce/
├── backend/
│   ├── config/          # Konfigurasi database dan cloudinary
│   ├── controllers/     # Pengendali logika bisnis
│   ├── middleware/      # Middleware (autentikasi, validasi)
│   ├── models/          # Model data MongoDB
│   ├── routes/          # Definisi rute API
│   └── server.js        # Entry point backend
│
├── frontend/
│   ├── public/          # Aset publik
│   ├── src/             # Kode sumber frontend
│   │   ├── components/  # Komponen React
│   │   ├── pages/       # Halaman aplikasi
│   │   └── App.jsx      # Komponen utama aplikasi
│   └── index.html       # Template HTML
```

### 7. Troubleshooting

#### Masalah Koneksi Database
- Pastikan URI MongoDB di `.env` sudah benar
- Periksa apakah server MongoDB berjalan
- Periksa log server untuk kesalahan koneksi
- Pastikan user database memiliki akses yang tepat
- Untuk MongoDB Atlas, periksa apakah IP Anda telah diizinkan dalam Network Access

#### Masalah Frontend-Backend Integrasi
- Pastikan backend berjalan sebelum frontend
- Periksa properti `proxy` di `frontend/package.json`

### 8. Kontribusi
Silakan buat Pull Request untuk kontribusi ke proyek ini.
# Percobaan Bikin 1 
# Homepage - 29/04/2025
# Pages:
- Login Page, Register Page