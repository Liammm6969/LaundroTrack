const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const usersFile = "users.json";
let orders = [];

// Helper Functions for User Data
function readData(file) {
    try {
        return JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch (err) {
        return [];
    }
}

function writeData(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function updateRecord(file, id, newData, key) {
    let data = readData(file);
    let index = data.findIndex(item => item[key] === id);
    if (index !== -1) {
        data[index] = { ...data[index], ...newData };
        writeData(file, data);
        return data[index];
    }
    return null;
}

// API Routes
app.get("/", (req, res) => {
    res.send("Laundry Management API");
});

// Fetch Orders
app.get("/fetchorders", (req, res) => {
    res.json(orders);
});

// Add Order
app.post("/addorder", (req, res) => {
    const newOrder = { id: Date.now().toString(), ...req.body };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

// Update Order
app.put("/updateorder/:orderId", (req, res) => {
    const { orderId } = req.params;
    const updatedOrder = req.body;

    const index = orders.findIndex(order => order.id === orderId);
    if (index !== -1) {
        Object.assign(orders[index], updatedOrder);
        res.json(orders[index]);
    } else {
        res.status(404).json({ message: "Order not found" });
    }
});

// Fetch Users
app.get("/fetchusers", (req, res) => {
    res.json(readData(usersFile));
});

// Add User
app.post("/addusers", (req, res) => {
    let users = readData(usersFile);
    users.push(req.body);
    writeData(usersFile, users);
    res.status(201).json(req.body);
});

// Update User
app.put("/updateuser/:id", (req, res) => {
    let updatedUser = updateRecord(usersFile, req.params.id, req.body, "userId");
    if (updatedUser) res.json(updatedUser);
    else res.status(404).json({ message: "User not found" });
});

// Delete User
app.delete("/deleteuser/:id", (req, res) => {
    let users = readData(usersFile);
    let filteredUsers = users.filter(user => user.userId !== req.params.id);

    if (users.length === filteredUsers.length) {
        return res.status(404).json({ message: "User not found" });
    }

    writeData(usersFile, filteredUsers);
    res.status(200).json({ message: "User Deleted" });
});
//Login
app.post("/login", (req, res) => {
    let users = readData(usersFile);
    const { userName, password } = req.body;

    const user = users.find(user => user.userName === userName && user.password === password);
    
    if (user) {
        res.status(200).json({ message: "Login successful", user });
    } else {
        res.status(401).json({ message: "Invalid username or password" });
    }
});
// Start Server
const port = 1337;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
