import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
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
    address: {
      street: {
        type: String,
        required: true,
        trim: true
      },
      city: {
        type: String,
        required: true,
        trim: true
      },
      postalCode: {
        type: String,
        required: true,
        trim: true
      }
    }
  },
  items: [{
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
    shipping: {
      type: Number,
      required: true,
      min: 0,
      default: 0
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
      'pending_confirmation',  // Menunggu konfirmasi admin
      'confirmed',            // Dikonfirmasi admin, siap pickup
      'picked_up',           // Sudah diambil customer
      'cancelled',           // Dibatalkan
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
    enum: ['cash', 'transfer', 'qris'],
    default: null
  },
  notes: {
    type: String,
    trim: true,
    default: ''
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
  estimatedPickupDate: {
    type: Date,
    default: null
  },
  adminNotes: {
    type: String,
    trim: true,
    default: ''
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

// Virtual untuk nama lengkap customer
orderSchema.virtual('customer.fullName').get(function() {
  return `${this.customer.firstName} ${this.customer.lastName}`;
});

// Virtual untuk total items
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Method untuk generate order number
orderSchema.statics.generateOrderNumber = function() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `KWU${year}${month}${day}${random}`;
};

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

// Pre-save hook untuk generate order number jika belum ada
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    let orderNumber;
    let isUnique = false;
    
    // Generate unique order number
    while (!isUnique) {
      orderNumber = this.constructor.generateOrderNumber();
      const existing = await this.constructor.findOne({ orderNumber });
      if (!existing) {
        isUnique = true;
      }
    }
    
    this.orderNumber = orderNumber;
  }
  next();
});

// Ensure virtual fields are serialized
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

const orderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default orderModel;
