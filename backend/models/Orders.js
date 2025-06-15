import mongoose, { mongo } from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    npm: {
      type: String,
      required: false,
      trim: true
    }
  },
  orderItems: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    productImage: {
      type: String,
      required: true
    },
    productPrice: {
      type: Number,
      required: true
    },
    size: {
      type: String,
      default: null
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    itemTotal: {
      type: Number,
      required: true
    }
  }],
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  status: {
    type: String,
    enum: [
      'pending_confirmation',  // Waiting for admin confirmation
      'confirmed',            // Confirmed by admin, ready for pickup
      'ready_pickup',         // Pesanan siap diambil (dengan notifikasi)
      'picked_up',           // Picked up by customer
      'cancelled',           // Cancelled
      'expired'              // Kadaluarsa (tidak diambil dalam waktu tertentu)
    ],
    default: 'pending_confirmation'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['QRIS'],
    default: null
  },
  paymentProof: {
    imageUrl: {
      type: String,
      default: null
    },
    cloudinaryId: {
      type: String,
      default: null
    },
    uploadedAt: {
      type: Date,
      default: null
    }
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  confirmationDate: {
    type: Date,
    default: null
  },
  pickupDate: {
    type: Date,
    default: null
  },
  adminNotes: {
    type: String,
    trim: true,
    default: ''
  },
  // Sistem notifikasi sederhana
  notifications: {
    readyPickupSent: {
      type: Boolean,
      default: false
    },
    readyPickupDate: {
      type: Date,
      default: null
    },
    newOrderNotified: {
      type: Boolean,
      default: false
    }
  },
  // Estimasi tanggal pickup
  estimatedPickupDate: {
    type: Date,
    default: null
  },
  // Tracking untuk perubahan status
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: String,
    notes: String
  }]
}, {
  timestamps: true
});

// Index untuk performa query
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderDate: -1 });

// Virtual untuk total items
orderSchema.virtual('totalItems').get(function() {
  return this.orderItems.reduce((total, item) => total + item.quantity, 0);
});

// Method untuk update status dengan history tracking
orderSchema.methods.updateStatus = function(newStatus, updatedBy = 'system', notes = '') {
  // Tambah ke history
  this.statusHistory.push({
    status: this.status,
    timestamp: new Date(),
    updatedBy,
    notes
  });
  
  // Update status
  this.status = newStatus;
  
  // Update tanggal spesifik berdasarkan status
  if (newStatus === 'confirmed') {
    this.confirmationDate = new Date();
    // Estimasi pickup 1-2 hari kerja
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 2);
    this.estimatedPickupDate = estimatedDate;
  } else if (newStatus === 'ready_pickup') {
    // Pesanan siap diambil
    this.notifications.readyPickupDate = new Date();
    this.notifications.readyPickupSent = false; // Reset untuk dikirim ulang jika perlu
    // Estimasi pickup dalam 7 hari
    const pickupDeadline = new Date();
    pickupDeadline.setDate(pickupDeadline.getDate() + 7);
    this.estimatedPickupDate = pickupDeadline;
  } else if (newStatus === 'picked_up') {
    this.pickupDate = new Date();
  }
  
  return this.save();
};

// Method untuk check apakah order sudah expired
orderSchema.methods.checkExpiration = function() {
  if (this.status === 'confirmed' && this.estimatedPickupDate) {
    const now = new Date();
    const expirationDate = new Date(this.estimatedPickupDate);
    expirationDate.setDate(expirationDate.getDate() + 7); // Grace period 7 hari
    
    if (now > expirationDate) {
      return true;
    }
  }
  return false;
};

// Ensure virtual fields are serialized
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

const orderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default orderModel;
