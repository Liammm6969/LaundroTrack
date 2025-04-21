const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const User = require('./models/User');
const Order = require('./models/Order');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB with explicit database name
mongoose.connect('mongodb+srv://hedmwpajarillo:williampajarillo21@laundrotrack.daf07zw.mongodb.net/laundrotrack?retryWrites=true&w=majority&appName=LaundroTrack')
  .then(() => {
    console.log('MongoDB Connected');
    console.log('Database name:', mongoose.connection.db.databaseName);
    console.log('User collection name:', User.collection.name);
    console.log('Order collection name:', Order.collection.name);
  })
  .catch(err => console.error('MongoDB Connection Error:', err));

// Monitor connection status
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));
mongoose.connection.on('error', err => console.error('MongoDB connection error:', err));

// Default Route
app.get("/", (req, res) => {
  res.send("Laundry Management API Connected to MongoDB");
});

// Database health check endpoint
app.get("/db-status", async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json({
      status: "connected",
      database: mongoose.connection.db.databaseName,
      collections: collections.map(c => c.name)
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ======== USERS ROUTES ========

// Fetch all users
app.get("/fetchusers", async (req, res) => {
  try {
    const users = await User.find();
    console.log(`Found ${users.length} users`);
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: err.message });
  }
});

// Add a new user
app.post("/addusers", async (req, res) => {
  try {
    console.log("Received user data:", req.body);
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    console.log("Saved user to database:", savedUser);
    
    // Verify user was added
    const userCount = await User.countDocuments();
    console.log(`Total users in database: ${userCount}`);
    
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(400).json({ message: err.message });
  }
});

// Update a user
app.put("/updateuser/:id", async (req, res) => {
  try {
    console.log("Update request for user ID:", req.params.id);
    console.log("Update data:", req.body);
    
    // Try to update by MongoDB _id first
    let updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    // If not found by _id, try by userId field
    if (!updatedUser) {
      updatedUser = await User.findOneAndUpdate(
        { userId: req.params.id }, 
        req.body, 
        { new: true }
      );
    }
    
    if (!updatedUser) {
      console.log("User not found for update");
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log("User updated successfully:", updatedUser);
    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a user
app.delete("/deleteuser/:id", async (req, res) => {
  try {
    console.log("Delete request for user ID:", req.params.id);
    
    // Try to delete by MongoDB _id first
    let deletedUser = await User.findByIdAndDelete(req.params.id);
    
    // If not found by _id, try by userId field
    if (!deletedUser) {
      deletedUser = await User.findOneAndDelete({ userId: req.params.id });
    }
    
    if (!deletedUser) {
      console.log("User not found for deletion");
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log("User deleted successfully:", deletedUser);
    res.json({ message: "User deleted", deletedUser });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: err.message });
  }
});

// User login
app.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;
    console.log("Login attempt for username:", userName);
    
    const user = await User.findOne({ userName, password });
    if (user) {
      console.log("Login successful for user:", user.firstName);
      res.status(200).json({ 
        message: "Login successful", 
        user: {
          _id: user._id,
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName
          // Note: not sending password back to client
        } 
      });
    } else {
      console.log("Login failed: Invalid credentials");
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ======== ORDERS ROUTES ========

// Fetch all orders
app.get("/fetchorder", async (req, res) => {
  try {
    const orders = await Order.find();
    console.log(`Found ${orders.length} orders`);
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: err.message });
  }
});

// Fetch orders by status
app.get("/fetchorder/status/:status", async (req, res) => {
  try {
    const status = req.params.status;
    const orders = await Order.find({ status });
    console.log(`Found ${orders.length} orders with status: ${status}`);
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders by status:", err);
    res.status(500).json({ message: err.message });
  }
});

// Fetch orders by customer
app.get("/fetchorder/customer/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const orders = await Order.find({ customerId });
    console.log(`Found ${orders.length} orders for customer: ${customerId}`);
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders by customer:", err);
    res.status(500).json({ message: err.message });
  }
});

// Add a new order
app.post("/addorder", async (req, res) => {
  try {
    console.log("Received order data:", req.body);
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    console.log("Saved order to database:", savedOrder);
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Error adding order:", err);
    res.status(400).json({ message: err.message });
  }
});

// Update an order
app.put("/updateorder/:orderId", async (req, res) => {
  try {
    console.log("Update request for order ID:", req.params.orderId);
    console.log("Update data:", req.body);
    
    // Try to update by MongoDB _id first
    let updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId, 
      req.body, 
      { new: true }
    );
    
    // If not found by _id, try by orderId field
    if (!updatedOrder) {
      updatedOrder = await Order.findOneAndUpdate(
        { orderId: req.params.orderId }, 
        req.body, 
        { new: true }
      );
    }
    
    if (!updatedOrder) {
      console.log("Order not found for update");
      return res.status(404).json({ message: "Order not found" });
    }
    
    console.log("Order updated successfully:", updatedOrder);
    res.json(updatedOrder);
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(400).json({ message: err.message });
  }
});

// Delete an order
app.delete("/deleteorder/:orderId", async (req, res) => {
  try {
    console.log("Delete request for order ID:", req.params.orderId);
    
    // Try to delete by MongoDB _id first
    let deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
    
    // If not found by _id, try by orderId field
    if (!deletedOrder) {
      deletedOrder = await Order.findOneAndDelete({ orderId: req.params.orderId });
    }
    
    if (!deletedOrder) {
      console.log("Order not found for deletion");
      return res.status(404).json({ message: "Order not found" });
    }
    
    console.log("Order deleted successfully:", deletedOrder);
    res.json({ message: "Order deleted", deletedOrder });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ message: err.message });
  }
});

// Update order status
app.patch("/updatestatus/:orderId", async (req, res) => {
  try {
    const { status } = req.body;
    console.log(`Updating order ${req.params.orderId} status to: ${status}`);
    
    // Try to update by MongoDB _id first
    let updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId, 
      { status }, 
      { new: true }
    );
    
    // If not found by _id, try by orderId field
    if (!updatedOrder) {
      updatedOrder = await Order.findOneAndUpdate(
        { orderId: req.params.orderId }, 
        { status }, 
        { new: true }
      );
    }
    
    if (!updatedOrder) {
      console.log("Order not found for status update");
      return res.status(404).json({ message: "Order not found" });
    }
    
    console.log("Order status updated successfully:", updatedOrder);
    res.json(updatedOrder);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(400).json({ message: err.message });
  }
});

// Start the server
const port = 1337;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
