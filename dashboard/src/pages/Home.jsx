import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, TextField, Modal, Box, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import Sidebar from "./Sidebar";
import ChatBot from "./ChatBot";
import "./Home.css";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Load orders from localStorage or start with an empty array
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const [openAdd, setOpenAdd] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    laundryWeight: "",
    amountToPay: "",
    date: "",
    serviceType: ""
  });

  // ✅ Ensure status updates are applied and saved
  useEffect(() => {
    if (location.state?.updatedOrder) {
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((order) =>
          order.id === location.state.updatedOrder.id ? location.state.updatedOrder : order
        );

        localStorage.setItem("orders", JSON.stringify(updatedOrders)); // ✅ Save to localStorage
        return updatedOrders;
      });
    }
  }, [location.state]);

  // ✅ Handle input changes
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => {
      let updatedData = { ...prev, [name]: value };

      if (name === "laundryWeight") {
        const weight = parseFloat(value);
        updatedData.amountToPay = weight >= 1 && weight <= 5 ? 150 : weight > 5 && weight <= 8 ? 180 : "";
      }

      return updatedData;
    });
  }

  // ✅ Add a new order and save to localStorage
  function handleAddOrder() {
    if (!formData.customerName || !formData.laundryWeight || !formData.date || !formData.serviceType) {
      alert("Please fill out all fields!");
      return;
    }

    const newOrder = {
      id: orders.length + 1,
      ...formData,
      status: "Pending"
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setOpenAdd(false);
    setFormData({ 
      customerName: "", 
      laundryWeight: "", 
      amountToPay: "", 
      date: "", 
      serviceType: "" });
  }

  const handleView = (order) => {
    navigate("/OrderStatus", { state: { order } });
  };

  function handleOpenAddModal() {
    setFormData({ 
      customerName: "", 
      laundryWeight: "", 
      amountToPay: "", 
      date: "", 
      serviceType: "" });
    setOpenAdd(true);
  }

  return (
    <div className="home">
      <Sidebar />
      <ChatBot />

      <div className="content">
        <div className="dashboard">
          <div className="dashboard-header">
            <h2>Dashboard</h2>
            <Button className="add-btn" onClick={handleOpenAddModal} startIcon={<AddShoppingCartIcon/>} variant="contained">Add Order</Button>
          </div>

          <div className="revenue-table">
            <h3>Orders</h3>
            <table>
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Weight (kg)</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Service Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>No orders yet.</td>
                  </tr>
                ) : (
                  orders.map((order, index) => (
                    <tr key={index}>
                      <td>{order.customerName}</td>
                      <td>{order.laundryWeight} kg</td>
                      <td>${order.amountToPay}</td>
                      <td>{order.date}</td>
                      <td>{order.serviceType}</td>
                      <td>{order.status}</td>
                      <td>
                        <button className="view-btn" onClick={() => handleView(order)}>View</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ✅ Add Order Modal */}
      <Modal open={openAdd} onClose={() => setOpenAdd(false)}>
        <Box className="modal-box">
          <h2>Add Order</h2>
          <TextField name="customerName" label="Customer Name" value={formData.customerName} onChange={handleChange} />
          <TextField name="laundryWeight" label="Laundry Weight (kg)" type="number" value={formData.laundryWeight} onChange={handleChange} />
          <TextField name="amountToPay" label="Amount to Pay ($)" type="number" value={formData.amountToPay} disabled />
          <TextField name="date" label="Date" type="date" value={formData.date} onChange={handleChange} />
          <FormControl fullWidth>
            <InputLabel>Service Type</InputLabel>
            <Select name="serviceType" value={formData.serviceType || ""} onChange={handleChange}>
              <MenuItem value="Wash">Wash</MenuItem>
              <MenuItem value="Dry">Dry</MenuItem>
              <MenuItem value="Wash & Dry">Wash & Dry</MenuItem>
            </Select>
          </FormControl>
          <div className="modal-buttons">
            <Button onClick={handleAddOrder}>Add Order</Button>
            <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Home;