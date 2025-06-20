# 🛒 E-Commerce KWU BEM - Student Organization Merchandise Store

Website e-commerce terintegrasi untuk penjualan merchandise Student Executive Organization (KWU BEM) dengan sistem otomatis dan keamanan tinggi.

## 📋 Daftar Isi
- [Fitur Utama](#-fitur-utama)
- [Teknologi](#-teknologi)
- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Panduan Penggunaan](#-panduan-penggunaan)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)

## 🚀 Fitur Utama

### ✅ **Fitur yang Sudah Selesai**
- **E-commerce Core**: Product catalog, shopping cart, checkout, payment system
- **User Management**: Registration, login, profile management, password change
- **Order Management**: Order tracking, status updates, order history
- **Admin Dashboard**: Order management, product management, analytics
- **Security**: JWT authentication, Redis session management, password hashing
- **Payment System**: Upload bukti pembayaran, QR code, instruksi transfer

### 🔧 **Fitur dalam Pengembangan**
- Email notification system
- Inventory management
- Advanced product search
- User analytics dashboard

## 🛠 Teknologi

### Frontend
- **React.js** - UI Framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Hot Toast** - Notifications
- **Swiper.js** - Image carousel

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Redis** - Session management & caching
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload

## 📋 Prasyarat

Pastikan sistem Anda memiliki:
- **Node.js** (v16 atau lebih baru)
- **npm** atau **yarn**
- **MongoDB** (local atau cloud)
- **Redis** (local atau cloud)
- **Git**

## 🔧 Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/your-username/e-commerce-kwu-bem.git
cd e-commerce-kwu-bem
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Install Root Dependencies (jika ada)
```bash
# Kembali ke root directory
cd ..
npm install
```

## ⚙️ Konfigurasi

### 1. MongoDB Setup

#### Option A: MongoDB Atlas (Cloud - Recommended)
1. Buat akun di [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Buat cluster baru
3. Buat database user
4. Whitelist IP address Anda
5. Dapatkan connection string

#### Option B: MongoDB Local
```bash
# Install MongoDB di sistem Anda
# Windows: Download dari mongodb.com
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb

# Start MongoDB service
mongod
```

### 2. Redis Setup

#### Option A: Redis Cloud (Recommended)
1. Buat akun di [Redis Cloud](https://redis.com/redis-enterprise-cloud/)
2. Buat database baru
3. Dapatkan connection details

#### Option B: Redis Local
```bash
# Install Redis
# Windows: Download dari redis.io
# macOS: brew install redis
# Ubuntu: sudo apt install redis-server

# Start Redis
redis-server
```

### 3. Environment Variables

#### Backend (.env)
Buat file `.env` di folder `backend/`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kwu-ecommerce

# Redis Configuration
REDIS_URL=redis://localhost:6379
# Atau untuk Redis Cloud:
# REDIS_URL=rediss://username:password@host:port

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-here
REFRESH_TOKEN_SECRET=your-refresh-token-secret-here

# Admin Credentials (Multiple Admin Support)
ADMIN_EMAIL=admin@kwu.ac.id
ADMIN_PASSWORD=admin123

# Optional: Additional Admin Accounts
ADMIN_EMAIL_2=admin2@kwu.ac.id
ADMIN_PASSWORD_2=admin456

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg

# CORS
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
Buat file `.env` di folder `frontend/`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BACKEND_URL=http://localhost:5000
```

### 4. Seed Database (Optional)
```bash
cd backend
npm run seed
```

## 🚀 Menjalankan Aplikasi

### Development Mode

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

#### Terminal 3 - Redis (jika local)
```bash
redis-server
```

### Production Mode

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Start Backend
```bash
cd backend
npm start
```

## 📖 Panduan Penggunaan

### 👤 **Untuk User (Mahasiswa)**

#### 1. Registrasi & Login
- Kunjungi website di `http://localhost:3000`
- Klik "Register" untuk membuat akun baru
- Isi data: Nama, NPM, Email, No. Telepon, Password
- Login dengan email dan password

#### 2. Berbelanja
- Browse produk di halaman "Catalog"
- Klik produk untuk melihat detail
- Tambahkan ke keranjang dengan tombol "Add to Cart"
- Atur quantity di halaman "Cart"
- Lanjut ke "Checkout"

#### 3. Checkout & Pembayaran
- Isi alamat pengiriman di halaman Checkout
- Review order dan klik "Place Order"
- Upload bukti pembayaran di halaman Payment
- Tunggu konfirmasi admin

#### 4. Tracking Order
- Cek status order di halaman "Orders"
- Lihat detail order dengan klik "View Details"
- Cancel order jika masih pending

#### 5. Profile Management
- Update profil di halaman "Profile"
- Ganti password di menu Security Settings
- Logout dari dropdown profile

### 👨‍💼 **Untuk Admin**

#### 1. Login Admin
- Akses `http://localhost:3000/admin/login`
- Login dengan credentials admin
- Akan diarahkan ke Admin Dashboard

#### 2. Manage Orders
- Tab "Orders" untuk melihat semua pesanan
- Update status order: Pending → Processing → Shipped → Delivered
- Konfirmasi pembayaran
- Filter orders berdasarkan status

#### 3. Manage Products
- Tab "Products" untuk manage produk
- Tambah produk baru
- Edit informasi produk
- Set featured products untuk homepage

#### 4. Analytics
- Tab "Overview" untuk statistik penjualan
- Monitor total orders, revenue, users
- Quick actions untuk management

### 🔐 **Keamanan**

#### Password Requirements
- Minimal 6 karakter
- Kombinasi huruf dan angka (recommended)
- Tidak boleh sama dengan password lama

#### Session Management
- Access token: 15 menit
- Refresh token: 7 hari
- Auto logout saat token expired
- Token blacklisting saat logout

## 📡 API Documentation

### Authentication Endpoints
```
POST /api/users/register     - User registration
POST /api/users/login        - User login
POST /api/users/logout       - User logout
POST /api/users/refresh-token - Refresh access token
```

### User Endpoints
```
GET  /api/users/profile      - Get user profile
POST /api/users/change-password - Change password
```

### Catalog Endpoints
```
GET  /api/catalog            - Get all products
GET  /api/catalog/:id        - Get product by ID
POST /api/catalog/create     - Create product (Admin)
PUT  /api/catalog/update/:id - Update product (Admin)
DELETE /api/catalog/delete/:id - Delete product (Admin)
```

### Order Endpoints
```
GET  /api/orders             - Get user orders
GET  /api/orders/all         - Get all orders (Admin)
POST /api/orders             - Create order
PUT  /api/orders/:id/status  - Update order status (Admin)
PUT  /api/orders/:id/payment - Update payment status (Admin)
```

### Cart Endpoints
```
GET  /api/cart               - Get user cart
POST /api/cart/add           - Add item to cart
PUT  /api/cart/update        - Update cart item
DELETE /api/cart/remove      - Remove item from cart
```

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: MongoNetworkError: failed to connect to server
```
**Solution:**
- Check MongoDB service is running
- Verify connection string in .env
- Check network connectivity
- Whitelist IP in MongoDB Atlas

#### 2. Redis Connection Error
```
Error: Redis connection failed
```
**Solution:**
- Check Redis service is running
- Verify REDIS_URL in .env
- Check Redis server status: `redis-cli ping`

#### 3. JWT Token Error
```
Error: JsonWebTokenError: invalid token
```
**Solution:**
- Clear browser localStorage
- Check JWT_SECRET in .env
- Re-login to get new token

#### 4. File Upload Error
```
Error: File too large
```
**Solution:**
- Check file size < 5MB
- Verify file type (jpg, png, jpeg only)
- Check MAX_FILE_SIZE in .env

#### 5. CORS Error
```
Error: Access to fetch blocked by CORS policy
```
**Solution:**
- Check FRONTEND_URL in backend .env
- Verify API_URL in frontend .env
- Restart both servers

### Performance Tips

#### 1. Redis Optimization
```bash
# Check Redis memory usage
redis-cli info memory

# Clear Redis cache if needed
redis-cli flushall
```

#### 2. MongoDB Optimization
```javascript
// Add indexes for better performance
db.users.createIndex({ email: 1 })
db.products.createIndex({ category: 1 })
db.orders.createIndex({ userId: 1, createdAt: -1 })
```

#### 3. Frontend Optimization
```bash
# Build optimized production bundle
npm run build

# Analyze bundle size
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js
```

## 📞 Support

Jika mengalami masalah:
1. Check troubleshooting section di atas
2. Lihat console logs untuk error details
3. Check network tab di browser developer tools
4. Hubungi tim development

## 🔄 Updates & Maintenance

### Regular Tasks
- Update dependencies: `npm update`
- Clear Redis cache: `redis-cli flushall`
- Backup MongoDB data
- Monitor server logs
- Check security updates

### Version Control
```bash
# Check current version
git log --oneline -5

# Pull latest updates
git pull origin main

# Install new dependencies
npm install
```

---

**Developed with ❤️ for KWU BEM Student Organization**