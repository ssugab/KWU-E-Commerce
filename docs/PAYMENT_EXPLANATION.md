# 📋 Penjelasan Lengkap Payment.jsx

## 🎯 **Tujuan Utama**
Halaman pembayaran yang memungkinkan user untuk:
1. ✅ Melihat ringkasan pesanan
2. 💳 Melakukan pembayaran via QR Code  
3. 📤 Upload bukti pembayaran
4. 📊 Melihat status pembayaran

---

## 🏗️ **Struktur Kode (Disederhanakan)**

### **1. 📦 Import & Setup**
```javascript
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckout } from '../hooks/useCheckout'
import { useAuth } from '../context/AuthContext'
// ... imports lainnya

const Payment = () => {
  const navigate = useNavigate();
  const { getCurrentOrderFromSession, updatePaymentStatus } = useCheckout();
  const { isAuthenticated, loading: authLoading } = useAuth();
```

### **2. 📦 State Management (Sederhana)**
```javascript
// 📦 STATE - Hanya yang diperlukan
const [order, setOrder] = useState(null);                    // Data pesanan
const [loading, setLoading] = useState(true);                // Loading state
const [paymentFile, setPaymentFile] = useState(null);        // File bukti bayar
const [filePreview, setFilePreview] = useState(null);        // Preview gambar
const [uploading, setUploading] = useState(false);           // Status upload
```

**Penjelasan State:**
- `order`: Menyimpan data pesanan yang akan dibayar
- `loading`: Menunjukkan apakah sedang loading data
- `paymentFile`: File bukti pembayaran yang dipilih user
- `filePreview`: URL preview gambar untuk ditampilkan
- `uploading`: Status apakah sedang proses upload

### **3. 🔐 Authentication Check**
```javascript
// 🔐 CEK LOGIN - Redirect jika belum login
useEffect(() => {
  if (!authLoading && !isAuthenticated) {
    toast.error('Silakan login terlebih dahulu');
    navigate('/login');
  }
}, [isAuthenticated, authLoading, navigate]);
```

**Penjelasan:**
- Cek apakah user sudah login
- Jika belum login, redirect ke halaman login
- `authLoading` memastikan kita tunggu sampai auth check selesai

### **4. 📋 Load Order Data**
```javascript
// 📋 LOAD ORDER - Ambil data pesanan
useEffect(() => {
  const loadOrder = async () => {
    if (!isAuthenticated || authLoading) return;
    
    setLoading(true);
    try {
      console.log('🔄 Loading order data...');
      const orderData = await getCurrentOrderFromSession();
      
      if (orderData) {
        console.log('✅ Order loaded:', orderData.orderNumber);
        setOrder(orderData);
      } else {
        console.log('❌ No order found');
        toast.error('Order tidak ditemukan. Silakan checkout kembali.');
        navigate('/cart');
      }
    } catch (error) {
      console.error('❌ Error loading order:', error);
      toast.error('Gagal memuat data pesanan');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  loadOrder();
}, [isAuthenticated, authLoading, getCurrentOrderFromSession, navigate]);
```

**Penjelasan:**
- Mengambil data pesanan dari session storage atau database
- Jika tidak ada order, redirect ke cart
- Error handling untuk kasus gagal load data

### **5. 📁 File Upload Handler**
```javascript
// 📁 HANDLE FILE UPLOAD - Validasi dan preview file
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // ✅ Validasi format file
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    toast.error('Format file tidak didukung. Gunakan JPG, JPEG, atau PNG.');
    return;
  }

  // ✅ Validasi ukuran file (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    toast.error('Ukuran file terlalu besar. Maksimal 5MB.');
    return;
  }

  // 💾 Simpan file dan buat preview
  setPaymentFile(file);
  
  const reader = new FileReader();
  reader.onload = (e) => setFilePreview(e.target.result);
  reader.readAsDataURL(file);
  
  console.log('📁 File selected:', file.name);
};
```

**Penjelasan:**
- **Validasi Format**: Hanya terima JPG, JPEG, PNG
- **Validasi Ukuran**: Maksimal 5MB untuk performa
- **FileReader**: Membuat preview gambar sebelum upload
- **readAsDataURL**: Mengkonversi file ke base64 untuk preview

### **6. 🚀 Submit Payment**
```javascript
// 🚀 SUBMIT PAYMENT - Kirim bukti pembayaran
const submitPayment = async () => {
  // ✅ Validasi
  if (!paymentFile) {
    toast.error('Silakan pilih file bukti pembayaran terlebih dahulu.');
    return;
  }

  if (!order) {
    toast.error('Data pesanan tidak ditemukan.');
    return;
  }

  setUploading(true);
  try {
    console.log('🚀 Submitting payment proof...');
    
    // 🔄 Simulasi upload file (dalam production akan upload ke cloudinary)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 📝 Update status pembayaran ke 'paid'
    const result = await updatePaymentStatus(order._id, 'paid', 'qris');
    
    if (result.success) {
      console.log('✅ Payment submitted successfully');
      toast.success('Bukti pembayaran berhasil dikirim! Pesanan akan segera diproses.');
      
      // 🔄 Redirect ke halaman orders setelah 2 detik
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } else {
      toast.error(result.message || 'Gagal mengirim bukti pembayaran');
    }
  } catch (error) {
    console.error('❌ Error submitting payment:', error);
    toast.error('Terjadi kesalahan saat mengirim bukti pembayaran');
  } finally {
    setUploading(false);
  }
};
```

**Penjelasan:**
- **Validasi**: Pastikan file dan order ada
- **Simulasi Upload**: Dalam production akan upload ke cloud storage
- **Update Status**: Ubah status pembayaran di database
- **User Feedback**: Toast notification dan redirect
- **Error Handling**: Tangani semua kemungkinan error

---

## 🎨 **UI Components**

### **1. 📋 Order Summary (Kiri)**
```javascript
{/* 📋 LEFT: ORDER SUMMARY */}
<div className='bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm'>
  <h2 className='font-atemica text-xl mb-6 text-gray-900'>📋 Ringkasan Pesanan</h2>
  
  <div className='space-y-4 mb-6'>
    <div className='flex justify-between'>
      <span className='text-gray-600'>Nomor Pesanan:</span>
      <span className='font-medium'>{order.orderNumber}</span>
    </div>
    {/* ... info lainnya */}
    
    <div className='flex justify-between text-lg font-bold'>
      <span>Total Pembayaran:</span>
      <span className='text-accent'>Rp {order.pricing?.total?.toLocaleString() || '0'}</span>
    </div>
  </div>

  {/* 💳 PAYMENT STATUS */}
  <div className='bg-gray-50 p-4 rounded-lg'>
    <div className='flex items-center gap-2 mb-2'>
      {isPaid ? (
        <FaCheckCircle className='text-green-500' />
      ) : (
        <div className='w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin'></div>
      )}
      <h3 className='font-semibold'>Status Pembayaran</h3>
    </div>
    <p className={`text-sm ${isPaid ? 'text-green-700' : 'text-orange-700'}`}>
      {isPaid ? 'Pembayaran Berhasil' : 'Menunggu Pembayaran'}
    </p>
  </div>
</div>
```

### **2. 💳 Payment Method (Kanan)**
```javascript
{/* 📱 QR CODE */}
<div className='bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm'>
  <h2 className='font-atemica text-xl mb-6 text-gray-900'>💳 Scan untuk Bayar</h2>
  
  <div className='text-center'>
    <div className='bg-gray-50 p-6 rounded-lg mb-4'>
      <img 
        src={assets.qrCode} 
        alt="QR Code Payment" 
        className='mx-auto max-w-full h-auto max-h-64 object-contain'
      />
    </div>
    <h3 className='font-semibold text-lg mb-2'>Scan QR Code</h3>
    <p className='text-gray-600 text-sm mb-4'>
      Gunakan aplikasi mobile banking atau e-wallet untuk pembayaran
    </p>
    <div className='bg-blue-50 p-3 rounded-lg'>
      <p className='text-blue-800 text-sm font-medium'>
        Total: Rp {order.pricing?.total?.toLocaleString() || '0'}
      </p>
    </div>
  </div>
</div>
```

### **3. 📤 Upload Form**
```javascript
{/* 📤 UPLOAD FORM */}
<div className='bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm'>
  <h2 className='font-atemica text-xl mb-6 text-gray-900'>📤 Upload Bukti Pembayaran</h2>
  
  <div className='space-y-4'>
    {/* 📁 FILE INPUT */}
    <input
      type="file"
      accept="image/jpeg,image/jpg,image/png"
      onChange={handleFileSelect}
      className='hidden'
      id='paymentFile'
      disabled={uploading}
    />
    <label
      htmlFor='paymentFile'
      className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
        paymentFile 
          ? 'border-green-300 bg-green-50' 
          : 'border-gray-300 bg-gray-50 hover:border-accent hover:bg-accent/10'
      } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className='text-center'>
        <FaUpload className='mx-auto h-8 w-8 text-gray-400 mb-2' />
        <p className='text-sm text-gray-600'>
          {paymentFile ? paymentFile.name : 'Klik untuk pilih file'}
        </p>
        <p className='text-xs text-gray-500 mt-1'>
          JPG, JPEG, PNG (Max 5MB)
        </p>
      </div>
    </label>

    {/* 🖼️ PREVIEW */}
    {filePreview && (
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Preview
        </label>
        <div className='relative'>
          <img
            src={filePreview}
            alt="Payment Proof Preview"
            className='w-full max-h-64 object-contain border-2 border-gray-200 rounded-lg'
          />
          <button
            onClick={() => {
              setPaymentFile(null);
              setFilePreview(null);
            }}
            className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'
            disabled={uploading}
          >
            <FaTimesCircle className='w-4 h-4' />
          </button>
        </div>
      </div>
    )}

    {/* 🚀 SUBMIT BUTTON */}
    <Button
      text={uploading ? 'Mengirim...' : 'Kirim Bukti Pembayaran'}
      onClick={submitPayment}
      disabled={!paymentFile || uploading}
      className={`w-full ${
        !paymentFile || uploading 
          ? 'bg-gray-300 cursor-not-allowed' 
          : 'bg-accent hover:bg-accent/90'
      }`}
    />
  </div>
</div>
```

---

## 🐛 **Masalah Orders Tidak Muncul & Solusinya**

### **🔍 Penyebab Masalah:**

1. **Session Storage Kosong**
   - `getCurrentOrderFromSession` hanya cek session storage
   - Setelah refresh browser, session bisa hilang

2. **Order ID Tidak Tersimpan**
   - Setelah checkout, order ID mungkin tidak tersimpan di session
   - User langsung ke payment tanpa melalui checkout

3. **Session Expired**
   - Order session kadaluarsa (>24 jam)
   - Data otomatis dihapus

### **✅ Solusi yang Diterapkan:**

**Di `useCheckout.js`:**
```javascript
// Get current order from session dengan validasi expiry dan fallback
const getCurrentOrderFromSession = useCallback(async () => {
  const orderId = sessionStorage.getItem('currentOrderId');
  
  if (orderId) {
    // Cek order dari session
    const result = await getOrder(orderId);
    if (result.success) {
      return result.order;
    }
  }
  
  // 🔄 FALLBACK: Jika tidak ada order di session, ambil order terbaru user
  const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
  if (userEmail) {
    const result = await getOrdersByEmail(userEmail, 1, 1); // Ambil 1 order terbaru
    if (result.success && result.orders && result.orders.length > 0) {
      const latestOrder = result.orders[0];
      
      // Hanya ambil order yang statusnya pending payment
      if (latestOrder.paymentStatus === 'pending') {
        // Simpan ke session untuk next time
        sessionStorage.setItem('currentOrderId', latestOrder._id);
        sessionStorage.setItem('currentOrderNumber', latestOrder.orderNumber);
        sessionStorage.setItem('orderCreatedAt', latestOrder.orderDate);
        
        return latestOrder;
      }
    }
  }
  
  return null;
}, [getOrder, getOrdersByEmail]);
```

**Penjelasan Solusi:**
1. **Primary**: Cek session storage dulu
2. **Fallback**: Jika kosong, ambil order terbaru dari database
3. **Filter**: Hanya ambil order dengan status `pending payment`
4. **Cache**: Simpan kembali ke session untuk performa

---

## 🎓 **Tips Pembelajaran**

### **1. 📚 Konsep yang Dipelajari:**
- **React Hooks**: useState, useEffect, useCallback
- **File Handling**: FileReader, file validation
- **API Integration**: Async/await, error handling
- **User Experience**: Loading states, feedback, validation
- **State Management**: Local state vs global state

### **2. 🔧 Best Practices:**
- **Validasi Input**: Selalu validasi file type dan size
- **Error Handling**: Tangani semua kemungkinan error
- **User Feedback**: Berikan feedback yang jelas
- **Loading States**: Tunjukkan progress ke user
- **Fallback Logic**: Siapkan plan B jika plan A gagal

### **3. 🚀 Pengembangan Selanjutnya:**
- **Real File Upload**: Integrasi dengan Cloudinary/AWS S3
- **Payment Gateway**: Integrasi dengan Midtrans/Xendit
- **Real-time Updates**: WebSocket untuk status updates
- **Offline Support**: Service Worker untuk offline capability

### **4. 🐛 Debugging Tips:**
- **Console Logs**: Gunakan emoji untuk mudah dibaca
- **Network Tab**: Cek API calls di browser dev tools
- **React DevTools**: Monitor state changes
- **Error Boundaries**: Tangani error di component level

---

## 📝 **Kesimpulan**

Payment.jsx adalah komponen yang:
- ✅ **Sederhana**: State dan logic yang minimal tapi efektif
- 🔒 **Aman**: Validasi input dan authentication check
- 🎨 **User-friendly**: UI yang intuitif dengan feedback yang jelas
- 🐛 **Robust**: Error handling dan fallback logic yang baik
- 📚 **Educational**: Kode yang mudah dipahami untuk pembelajaran

Masalah orders tidak muncul sudah diperbaiki dengan menambahkan fallback logic yang mengambil order terbaru dari database jika session storage kosong. 