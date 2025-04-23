const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: String,
  customerId: String,
  customerName: String,
  laundryWeight: Number,
  amountToPay: Number,
  serviceType: String,
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Ready', 'Delivered'],
    default: 'Pending'
  },
  date: {
    type: Date,
    default: Date.now
  },
  dateCompleted: Date
});

module.exports = mongoose.model('Order', orderSchema);