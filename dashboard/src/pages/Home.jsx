import { useState, useEffect, useMemo } from "react";
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
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0);
  
  // Filter orders based on search term
  const filteredOrders = useMemo(() => {
    return orders.filter(order => 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId?.toString().includes(searchTerm) ||
      order.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);
  
  // Apply pagination to filtered orders
  const pageData = useMemo(() => {
    const startIndex = page * 10;
    const endIndex = startIndex + 10;
    return filteredOrders.slice(startIndex, endIndex);
  }, [page, filteredOrders]);
  
  const totalPages = Math.ceil(filteredOrders.length / 10);
  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => (prev > 0 ? prev - 1 : prev));
  const goToPage = (pageNum) => setPage(pageNum);

  const [formData, setFormData] = useState({
    orderId: "",
    customerName: "",
    laundryWeight: "",
    amountToPay: "",
    date: "",
    serviceType: "",
  });

  // Load orders from API instead of localStorage
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch orders from API
  async function fetchOrders() {
    try {
      const { data } = await axios.get("http://localhost:1337/fetchorder");
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  }

  useEffect(() => {
    if (location.state?.updatedOrder) {
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map(order => 
          order.id === location.state.updatedOrder.id ? location.state.updatedOrder : order
        );
        return updatedOrders;
      });
    }
  }, [location.state]);

  // Reset page when search term changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

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
        status: "Processing",
      };

      const { data } = await axios.post(
        "http://localhost:1337/addorder",
        newOrder
      );
      
      // Update the orders state with the new order (includes the ID from the server)
      setOrders(prevOrders => [...prevOrders, data]);
      
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
      console.log(`Deleting order with ID: ${orderId}`);
      await axios.delete(`http://localhost:1337/deleteorder/${orderId}`);
      // After successful deletion, refresh the orders list
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order. Please try again.");
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

  // Get status class for styling
  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return 'status-active';
      case 'processing':
        return 'status-processing';
      case 'cancelled':
        return 'status-inactive';
      default:
        return 'status-processing';
    }
  };

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
            <h3>
              Orders
              <div className="table-controls">
                <TextField 
                  className="search-field"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </h3>
            
            {filteredOrders.length === 0 ? (
                <p>No orders found</p>
            ) : (
              <>
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
                    {pageData.map((order, index) => (
                      <tr key={order.id || index}>
                        <td>{order.orderId || order.id}</td>
                        <td>{order.customerName}</td>
                        <td>{order.laundryWeight} kg</td>
                        <td>₱{order.amountToPay}</td>
                        <td>{order.date}</td>
                        <td>{order.serviceType}</td>
                        <td>
                          <span className={`status-indicator ${getStatusClass(order.status)}`}></span>
                          {order.status}
                        </td>
                        <td className="row-actions">
                          <button
                            className="view-btn"
                            onClick={() => handleView(order)}
                          >
                            View
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteOrder(order.orderId)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="table-pagination">
                  <span className="pagination-info">
                    Showing {pageData.length ? page * 10 + 1 : 0}-{Math.min((page + 1) * 10, filteredOrders.length)} of {filteredOrders.length}
                  </span>
                  <button 
                    onClick={prevPage} 
                    disabled={page === 0} 
                    className="pagination-btn"
                  >
                    <NavigateBeforeIcon />
                  </button>
                  
                  {[...Array(Math.min(totalPages, 3))].map((_, i) => {
                    // Adjust displayed page numbers when current page is high
                    let pageNum = i;
                    if (page > 1 && totalPages > 3) {
                      pageNum = page - 1 + i;
                      // Don't exceed total pages
                      if (pageNum >= totalPages) {
                        pageNum = totalPages - 3 + i;
                      }
                    }
                    
                    if (pageNum < 0) pageNum = i;
                    
                    
                    if (pageNum < totalPages) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`pagination-btn ${page === pageNum ? 'active' : ''}`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={nextPage}
                    disabled={(page + 1) * 10 >= filteredOrders.length}
                    className="pagination-btn"
                  >
                    <NavigateNextIcon />
                  </button>
                </div>
              </>
            )}
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