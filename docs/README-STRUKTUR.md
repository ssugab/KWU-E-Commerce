# 🏗️ Panduan Struktur Proyek E-Commerce KWU BEM

## 📋 Daftar Isi
- [Pengenalan](#pengenalan)
- [Cara Menggunakan](#cara-menggunakan)
- [Struktur Frontend](#struktur-frontend)
- [Struktur Backend](#struktur-backend)
- [Penjelasan Folder](#penjelasan-folder)
- [Best Practices](#best-practices)

## 🎯 Pengenalan

Repositori ini berisi struktur folder yang terorganisir untuk proyek E-Commerce KWU BEM dengan arsitektur frontend (React) dan backend (Node.js) yang terpisah.

## 🚀 Cara Menggunakan

### 1. Membuat Struktur Otomatis
```bash
# Jalankan script untuk membuat struktur folder
node create-structure.js
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit file .env sesuai konfigurasi Anda
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit file .env sesuai konfigurasi Anda
npm run dev
```

## ⚛️ Struktur Frontend

### 📁 Penjelasan Folder Frontend

| Folder | Deskripsi |
|--------|-----------|
| `src/components/` | Komponen React yang dapat digunakan kembali |
| `src/pages/` | Halaman utama aplikasi |
| `src/context/` | Context API untuk state management global |
| `src/hooks/` | Custom hooks untuk logic yang dapat digunakan kembali |
| `src/services/` | Fungsi untuk komunikasi dengan API |
| `src/utils/` | Utility functions dan helper |
| `src/assets/` | Asset statis (gambar, font, icon) |
| `src/styles/` | File CSS dan styling |

### 🔧 Komponen Frontend

#### Common Components
- `Button.jsx` - Komponen tombol yang dapat dikustomisasi
- `Navbar.jsx` - Navigation bar
- `Footer.jsx` - Footer website
- `Loading.jsx` - Loading spinner/skeleton
- `Modal.jsx` - Modal dialog

#### Product Components
- `ProductGrid.jsx` - Grid layout untuk menampilkan produk
- `ProductCard.jsx` - Card individual produk
- `ProductDetail.jsx` - Detail produk
- `ProductFilter.jsx` - Filter dan pencarian produk

#### Cart Components
- `CartItem.jsx` - Item dalam keranjang
- `CartSummary.jsx` - Ringkasan keranjang
- `CartDrawer.jsx` - Sidebar keranjang

## 📦 Struktur Backend

### 📁 Penjelasan Folder Backend

| Folder | Deskripsi |
|--------|-----------|
| `src/controllers/` | Logic bisnis dan handler request |
| `src/models/` | Schema database (MongoDB/Mongoose) |
| `src/routes/` | Definisi endpoint API |
| `src/middleware/` | Middleware untuk authentication, validation, dll |
| `src/services/` | Business logic yang kompleks |
| `src/config/` | Konfigurasi database, JWT, dll |
| `src/utils/` | Utility functions dan helper |
| `uploads/` | Folder untuk file upload |
| `tests/` | Unit dan integration tests |

### 🛠️ API Endpoints

#### Authentication
- `POST /api/auth/register` - Registrasi user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh token

#### Products
- `GET /api/products` - Get semua produk
- `GET /api/products/:id` - Get produk by ID
- `POST /api/products` - Create produk (admin)
- `PUT /api/products/:id` - Update produk (admin)
- `DELETE /api/products/:id` - Delete produk (admin)

#### Cart
- `GET /api/cart` - Get keranjang user
- `POST /api/cart/add` - Tambah item ke keranjang
- `PUT /api/cart/update` - Update quantity item
- `DELETE /api/cart/remove` - Hapus item dari keranjang

#### Orders
- `GET /api/orders` - Get order history user
- `POST /api/orders` - Create order baru
- `GET /api/orders/:id` - Get detail order
- `PUT /api/orders/:id/status` - Update status order (admin)

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  profile: {
    phone: String,
    address: String,
    avatar: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: ObjectId (ref: Category),
  images: [String],
  stock: Number,
  sizes: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId (ref: Product),
    quantity: Number,
    size: String,
    price: Number
  }],
  totalAmount: Number,
  status: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String
  },
  paymentMethod: String,
  paymentStatus: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Best Practices

### Frontend
1. **Komponen Naming**: Gunakan PascalCase untuk nama komponen
2. **File Organization**: Kelompokkan komponen berdasarkan fungsi
3. **State Management**: Gunakan Context API untuk state global
4. **Custom Hooks**: Pisahkan logic yang dapat digunakan kembali
5. **Error Handling**: Implementasikan error boundary
6. **Performance**: Gunakan React.memo dan useMemo untuk optimasi

### Backend
1. **API Design**: Ikuti RESTful API conventions
2. **Error Handling**: Implementasikan centralized error handling
3. **Validation**: Validasi input di middleware
4. **Security**: Gunakan helmet, cors, dan rate limiting
5. **Database**: Gunakan indexing untuk query yang sering digunakan
6. **Testing**: Tulis unit dan integration tests

### General
1. **Environment Variables**: Jangan commit file .env
2. **Git**: Gunakan conventional commits
3. **Documentation**: Update dokumentasi saat ada perubahan
4. **Code Review**: Lakukan code review sebelum merge
5. **Deployment**: Gunakan CI/CD pipeline

## 🔧 Scripts Berguna

### Frontend Scripts
```bash
npm run dev          # Development server
npm run build        # Build untuk production
npm run preview      # Preview build
npm run lint         # Linting
npm run test         # Run tests
```

### Backend Scripts
```bash
npm run dev          # Development server dengan nodemon
npm start            # Production server
npm test             # Run tests
npm run test:watch   # Watch mode testing
```

## 📝 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_MIDTRANS_CLIENT_KEY=your-midtrans-client-key
VITE_APP_NAME=E-Commerce KWU BEM
```

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce-kwu-bem
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=5000
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build project: `npm run build`
2. Deploy folder `dist/`
3. Set environment variables di dashboard

### Backend (Railway/Heroku)
1. Set environment variables
2. Deploy dengan Git
3. Setup database connection

### Database (MongoDB Atlas)
1. Create cluster di MongoDB Atlas
2. Setup network access
3. Get connection string
4. Update MONGODB_URI

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini atau hubungi tim development KWU BEM.

---

**Happy Coding! 🎉** 