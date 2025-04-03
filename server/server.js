const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const usersFile = "users.json";
const orderFile = "addorders.json";
let orders = [];

function readData(file) {
    try {
        if (!fs.existsSync(file)) {
            writeData(file, []);
        }
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

app.get("/", (req, res) => {
    res.send("Laundry Management API");
});

app.get("/fetchorder", function(req, res) {
    res.json(readData(orderFile));
});

app.post("/addorder", (req, res) => {
    let users = readData(orderFile);
    users.push(req.body);
    writeData(orderFile, users);
    res.status(201).json(req.body);
});
app.put("/updateorder/:orderId", function(req, res) {
    var updated = updateRecord(orderFile, req.params.id, req.body, "id");
    if (updated) res.json(updated);
    else res.status(404).json({ message: "Order not found" });
});

app.delete("/deleteorder/:orderId", function(req, res){
    let { id } = req.params;
    let Order = JSON.parse(fs.readFileSync("addorders.json", "utf-8"));
  
    Order = Order.filter((Order) => Order.orderId !== id);
  
    fs.writeFileSync("addorders.json", JSON.stringify(Order, null, 2));
    res.status(200).json({
      message: "Order Deleted",
      Order,
    });
});

app.get("/fetchusers", function(req, res) {
    res.json(readData(usersFile));
});

app.post("/addusers", function(req, res) {
    let users = readData(usersFile);
    users.push(req.body);
    writeData(usersFile, users);
    res.status(201).json(req.body);
});

app.put("/updateuser/:id", function(req, res) {
    var updated = updateRecord(usersFile, req.params.id, req.body, "userId");
    if (updated) res.json(updated);
    else res.status(404).json({ message: "User not found" });
});

app.delete("/deleteuser/:id", function(req, res){
    let { id } = req.params;
    let User = JSON.parse(fs.readFileSync("users.json", "utf-8"));
  
    User = User.filter((User) => User.userId !== id);
  
    fs.writeFileSync("users.json", JSON.stringify(User, null, 2));
    res.status(200).json({
      message: "User Deleted",
      User,
    });
});

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

const port = 1337;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
