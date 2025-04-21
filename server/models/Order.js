const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: String,
  customerId: String,
  customerName: String,
  laundryWeight: String,
  amountToPay: Number,
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Ready', 'Delivered'],
    default: 'Pending'
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  dateCompleted: Date
});

module.exports = mongoose.model('Order', orderSchema);