import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  TextField,
  Modal,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  InputAdornment,
} from "@mui/material";
import Sidebar from "./Sidebar";
import ChatBot from "./ChatBot";
import "./Home.css";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  function getInitialOrders() {
    const savedOrders = localStorage.getItem("addorders");
    if (savedOrders) {
      return JSON.parse(savedOrders);
    } else {
      return [];
    }
  }
  const [orders, setOrders] = useState(getInitialOrders);
  const [openAdd, setOpenAdd] = useState(false);

  const [formData, setFormData] = useState({
    orderId: "",
    customerName: "",
    laundryWeight: "",
    amountToPay: "",
    date: "",
    serviceType: "",
  });

  useEffect(() => {
    if (location.state?.updatedOrder) {
      setOrders((prevOrders) => {
        const updatedOrders = [];
        for (let i = 0; i < prevOrders.length; i++) {
          if (prevOrders[i].id === location.state.updatedOrder.id) {
            updatedOrders.push(location.state.updatedOrder);
          } else {
            updatedOrders.push(prevOrders[i]);
          }
        }
        localStorage.setItem("addorders", JSON.stringify(updatedOrders));
        return updatedOrders;
      });
    }
  }, [location.state]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => {
      let updatedData = { ...prev, [name]: value };

      if (name === "laundryWeight") {
        const weight = parseFloat(value);

        if (weight >= 1 && weight <= 5) {
          updatedData.amountToPay = 150;
        } else if (weight > 5 && weight <= 8) {
          updatedData.amountToPay = 180;
        } else {
          updatedData.amountToPay = "";
        }
      }
      return updatedData;
    });
  }

  async function handleAddOrder() {
    try {
      if (
        !formData.customerName ||
        !formData.laundryWeight ||
        !formData.date ||
        !formData.serviceType
      ) {
        alert("Please fill out all fields!");
        return;
      }

      const newOrder = {
        ...formData,
        status: "Pending",
      };

      const { data } = await axios.post(
        "http://localhost:1337/addorder",
        newOrder
      );
      console.log("Order added:", data);
      setOrders((prevOrders) => [...prevOrders, data]);
      localStorage.setItem("addorders", JSON.stringify([...orders, data]));
      console.log(localStorage.getItem("addorders"));
      setOpenAdd(false);
      setFormData({
        orderId: "",
        customerName: "",
        laundryWeight: "",
        amountToPay: "",
        date: "",
        serviceType: "",
      });
    } catch (error) {
      console.error("Error adding order:", error);
    }
  }
  async function handleDeleteOrder(orderId) {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const response = await axios.delete(
        `http://localhost:1337/deleteorder/${orderId}`
      );

      if (response.status === 200) {
        const updatedOrders = orders.filter((order) => order.id !== orderId);
        setOrders(updatedOrders);
        localStorage.setItem("addorders.json", JSON.stringify(updatedOrders));
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  }

  const handleView = (order) => {
    navigate("/OrderStatus", { state: { order } });
  };

  function handleOpenAddModal() {
    setFormData({
      orderId: "",
      customerName: "",
      laundryWeight: "",
      amountToPay: "",
      date: "",
      serviceType: "",
    });
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
            <Button
              className="add-btn"
              onClick={handleOpenAddModal}
              startIcon={<AddShoppingCartIcon />}
              variant="contained"
            >
              Add Order
            </Button>
          </div>

          <div className="revenue-table">
            <h3>Orders</h3>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
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
                    <td colSpan="8" style={{ textAlign: "center" }}>
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => (
                    <tr key={index}>
                      <td>{order.orderId}</td>
                      <td>{order.customerName}</td>
                      <td>{order.laundryWeight} kg</td>
                      <td>${order.amountToPay}</td>
                      <td>{order.date}</td>
                      <td>{order.serviceType}</td>
                      <td>{order.status}</td>
                      <td>
                        <button
                          className="view-btn"
                          onClick={() => handleView(order)}
                        >
                          View
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal open={openAdd} onClose={() => setOpenAdd(false)}>
        <Box className="modal-box">
          <h2>Add Order</h2>
          <TextField
  name="orderId"
  label="Order Id"
  value={formData.orderId}
  onChange={handleChange}
/>

          <TextField
            name="customerName"
            label="Customer Name"
            value={formData.customerName}
            onChange={handleChange}
          />
          <TextField
            name="laundryWeight"
            label="Laundry Weight (kg)"
            type="number"
            value={formData.laundryWeight}
            onChange={handleChange}
          />
          <TextField
            name="amountToPay"
            label="Amount to Pay ($)"
            type="number"
            value={formData.amountToPay}
            disabled
          />
          <TextField
            name="date"
            label="Date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CalendarTodayIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Service Type</InputLabel>
            <Select
              name="serviceType"
              value={formData.serviceType || ""}
              onChange={handleChange}
            >
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
