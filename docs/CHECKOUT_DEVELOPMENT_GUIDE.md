# 🛒 Panduan Pengembangan Sistem Checkout E-Commerce KWU BEM

## 📋 Overview

Sistem checkout telah dirancang ulang dengan arsitektur yang lebih terstruktur, responsif, dan mudah dikembangkan. Berikut adalah panduan lengkap untuk pengembangan lebih lanjut.

## 🚀 Fitur yang Sudah Diimplementasi

### Frontend
- ✅ Layout checkout yang responsif dan modern
- ✅ Progress indicator untuk tracking tahapan
- ✅ Komponen OrderSummary yang interaktif
- ✅ Validasi form yang komprehensif
- ✅ Hook custom `useCheckout` untuk state management
- ✅ Loading states dan error handling
- ✅ Integrasi dengan ShopContext

### Backend
- ✅ Model Order dengan schema lengkap
- ✅ Controller dengan semua operasi CRUD
- ✅ Routes untuk API endpoints
- ✅ Validasi data server-side
- ✅ Status tracking dan history
- ✅ Kalkulasi harga otomatis

## 📁 Struktur File

```
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Checkout.jsx              # Halaman checkout utama
│   │   ├── components/
│   │   │   ├── CheckoutForm.jsx          # Form informasi customer
│   │   │   └── OrderSummary.jsx          # Ringkasan pesanan
│   │   ├── hooks/
│   │   │   └── useCheckout.js            # Hook untuk logika checkout
│   │   └── config/
│   │       └── api.js                    # Konfigurasi API endpoints
│   
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── Order.js                  # Schema order MongoDB
│   │   ├── controllers/
│   │   │   └── orderController.js        # Logic handling orders
│   │   └── routes/
│   │       └── orders.js                 # Route definitions
```

## 🔧 Implementasi Hook useCheckout

### Fungsi Utama
```javascript
const {
  isLoading,           // Status loading
  orderData,           // Data order saat ini
  createOrder,         // Membuat order baru
  getOrder,           // Ambil data order
  updateOrderStatus,   // Update status order
  validateOrderData,   // Validasi data order
  calculateShipping,   // Hitung ongkos kirim
  generateOrderNumber, // Generate nomor order
  resetOrderData      // Reset state
} = useCheckout();
```

### Contoh Penggunaan
```javascript
// Membuat order baru
const handleFormSubmit = async (formData) => {
  const orderData = {
    customerInfo: formData,
    items: cartData,
    subtotal: getCartAmount(),
    shipping: calculateShipping(getCartAmount()),
    total: getCartAmount() + calculateShipping(getCartAmount())
  };

  const result = await createOrder(orderData);
  if (result.success) {
    navigate('/payment');
  }
};
```

## 🗄️ Database Schema Order

### Struktur Data
```javascript
{
  orderNumber: "KWU24120111",
  customer: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "08123456789",
    address: {
      street: "Jl. Example No. 123",
      city: "Surabaya",
      postalCode: "60119"
    }
  },
  items: [{
    productId: ObjectId,
    productName: "KAOS FASILKOM",
    productImage: "image_url",
    productPrice: 80000,
    size: "L",
    quantity: 2,
    itemTotal: 160000
  }],
  pricing: {
    subtotal: 160000,
    shipping: 0,
    total: 160000
  },
  status: "pending_confirmation",
  paymentStatus: "pending",
  orderDate: ISODate,
  statusHistory: [...]
}
```

### Status Order
- `pending_confirmation` - Menunggu konfirmasi admin
- `confirmed` - Dikonfirmasi, siap pickup
- `picked_up` - Sudah diambil customer
- `cancelled` - Dibatalkan
- `expired` - Kadaluarsa

## 🌐 API Endpoints

### Public Endpoints
```
POST /api/orders/create           # Buat order baru
GET  /api/orders/number/:number   # Cari by order number
GET  /api/orders/customer/:email  # Orders by customer email
```

### Protected Endpoints
```
GET    /api/orders/:id            # Detail order
PATCH  /api/orders/:id/cancel     # Cancel order
```

### Admin Endpoints
```
GET    /api/orders                # Semua orders (dengan filter)
PATCH  /api/orders/:id/status     # Update status
PATCH  /api/orders/:id/payment    # Update payment status
DELETE /api/orders/:id            # Hapus order
```

## 💻 Contoh Request/Response

### Create Order
```javascript
// Request
POST /api/orders/create
{
  "customer": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "08123456789",
    "address": {
      "street": "Jl. Example No. 123",
      "city": "Surabaya",
      "postalCode": "60119"
    }
  },
  "items": [{
    "productId": "674abcd123456789",
    "size": "L",
    "quantity": 2
  }],
  "notes": "Tolong siapkan sebelum jam 15:00"
}

// Response
{
  "success": true,
  "message": "Pesanan berhasil dibuat",
  "order": {
    "_id": "674xyz987654321",
    "orderNumber": "KWU24120111",
    // ... data order lengkap
  }
}
```

## 🎨 Styling dan UI/UX

### Progress Indicator
```jsx
{/* Progress steps with visual feedback */}
<div className="flex items-center space-x-4">
  <div className="flex items-center">
    <div className="w-8 h-8 bg-green-500 text-white rounded-full">✓</div>
    <span className="ml-2 text-green-600">Keranjang</span>
  </div>
  <div className="w-8 h-1 bg-accent"></div>
  <div className="flex items-center">
    <div className="w-8 h-8 bg-accent text-white rounded-full">2</div>
    <span className="ml-2 text-gray-900">Checkout</span>
  </div>
</div>
```

### Responsive Grid Layout
```jsx
{/* Main content menggunakan grid responsive */}
<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
  <div className='lg:col-span-2 space-y-6'>
    {/* Form & Info */}
  </div>
  <div className='lg:col-span-1'>
    <div className='sticky top-4'>
      <OrderSummary />
    </div>
  </div>
</div>
```

## 🔄 State Management Flow

```
1. User mengisi CheckoutForm
2. Form validation di client-side
3. Data dikirim ke useCheckout hook
4. Hook memformat dan validasi data
5. API call ke backend untuk create order
6. Backend validasi dan simpan ke database
7. Response dikembalikan ke frontend
8. Redirect ke halaman payment jika sukses
```

## 🚧 Pengembangan Selanjutnya

### Phase 1: Payment Integration
```javascript
// Di frontend/src/pages/Payment.jsx
import { useCheckout } from '../hooks/useCheckout';

const Payment = () => {
  const { orderData, updatePaymentStatus } = useCheckout();
  
  const handlePayment = async (paymentMethod) => {
    // Implementasi payment gateway
    const result = await processPayment(orderData, paymentMethod);
    if (result.success) {
      await updatePaymentStatus(orderData._id, 'paid', paymentMethod);
    }
  };
};
```

### Phase 2: Order Tracking
```javascript
// Di frontend/src/pages/Orders.jsx
import { useCheckout } from '../hooks/useCheckout';

const Orders = () => {
  const { getOrdersByEmail } = useCheckout();
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    const fetchOrders = async () => {
      const result = await getOrdersByEmail(userEmail);
      setOrders(result.orders);
    };
    fetchOrders();
  }, []);
};
```

### Phase 3: Admin Dashboard
```javascript
// Di frontend/src/pages/admin/OrderManagement.jsx
const OrderManagement = () => {
  const { getAllOrders, updateOrderStatus } = useCheckout();
  
  const handleStatusUpdate = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    // Refresh data
  };
};
```

### Phase 4: Notifications
```javascript
// Email notifications
// WhatsApp integration
// Real-time updates dengan Socket.IO
```

## 🔧 Environment Setup

### Backend Dependencies
```json
{
  "mongoose": "^7.0.0",
  "express": "^4.18.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.0"
}
```

### Frontend Dependencies
```json
{
  "react": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "axios": "^1.0.0",
  "react-hot-toast": "^2.4.0"
}
```

### Environment Variables
```bash
# Backend .env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kwu-ecommerce
NODE_ENV=development

# Frontend .env
VITE_BACKEND_URL=http://localhost:5000
```

## 🧪 Testing Strategy

### Unit Tests
```javascript
// Test useCheckout hook
describe('useCheckout', () => {
  it('should validate order data correctly', () => {
    const { validateOrderData } = useCheckout();
    const result = validateOrderData(mockOrderData);
    expect(result.isValid).toBe(true);
  });
});
```

### Integration Tests
```javascript
// Test API endpoints
describe('Order API', () => {
  it('should create order successfully', async () => {
    const response = await request(app)
      .post('/api/orders/create')
      .send(mockOrderData);
    expect(response.status).toBe(201);
  });
});
```

## 📱 Mobile Responsiveness

### Breakpoint Strategy
- `sm:` 640px+ - Mobile landscape
- `md:` 768px+ - Tablet
- `lg:` 1024px+ - Desktop
- `xl:` 1280px+ - Large desktop

### Mobile-First Approach
```jsx
{/* Responsive classes */}
<div className='grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8'>
  <div className='space-y-4 lg:space-y-6'>
    {/* Mobile: stacked vertically */}
    {/* Desktop: 2/3 width */}
  </div>
  <div className='lg:sticky lg:top-4'>
    {/* Mobile: normal flow */}
    {/* Desktop: sticky sidebar */}
  </div>
</div>
```

## 🛡️ Security Considerations

### Input Validation
- Server-side validation untuk semua input
- Sanitasi data sebelum simpan ke database
- Rate limiting untuk API endpoints

### Data Protection
- Hash sensitive data
- Implementasi CORS policy
- Environment variables untuk secrets

## 📈 Performance Optimization

### Frontend
```javascript
// Lazy loading components
const OrderSummary = lazy(() => import('../components/OrderSummary'));

// Memoization untuk expensive calculations
const orderCalculations = useMemo(() => {
  return calculateOrderTotals(cartData);
}, [cartData]);

// Debounce untuk form validation
const debouncedValidation = useCallback(
  debounce(validateForm, 300),
  [formData]
);
```

### Backend
```javascript
// Database indexing
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ status: 1 });

// Pagination untuk large datasets
const orders = await Order.find(filter)
  .limit(limit * 1)
  .skip((page - 1) * limit);
```

## 🎯 Best Practices

### Component Structure
```javascript
// Separation of concerns
const Checkout = () => {
  // Business logic
  const { createOrder } = useCheckout();
  
  // UI rendering
  return (
    <CheckoutLayout>
      <CheckoutForm onSubmit={handleSubmit} />
      <OrderSummary data={orderData} />
    </CheckoutLayout>
  );
};
```

### Error Handling
```javascript
// Consistent error responses
try {
  const result = await createOrder(orderData);
} catch (error) {
  if (error.response?.status === 400) {
    toast.error(error.response.data.message);
  } else {
    toast.error('Terjadi kesalahan. Silakan coba lagi.');
  }
}
```

### Code Organization
```
hooks/
├── useCheckout.js      # Order management
├── useCart.js          # Cart operations
├── usePayment.js       # Payment processing
└── useAuth.js          # Authentication

services/
├── orderService.js     # Order API calls
├── paymentService.js   # Payment API calls
└── notificationService.js  # Notifications
```

## 📚 Resources

### Documentation
- [React Hook Documentation](https://reactjs.org/docs/hooks-intro.html)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Express.js Documentation](https://expressjs.com/)

### Tools
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [Postman](https://www.postman.com/) - API testing
- [React DevTools](https://react.dev/learn/react-developer-tools) - React debugging

---

**Dibuat untuk proyek E-Commerce KWU BEM dengan ❤️**

Semoga dokumentasi ini membantu dalam pengembangan sistem checkout yang lebih baik! 