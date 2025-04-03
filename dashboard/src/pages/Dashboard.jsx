import { useState, useEffect } from "react";
import { Box, Typography, Button, Tabs, Tab, Card, CardContent, Grid, AppBar, Toolbar, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import OrderBarChart from "./BarChart";
import Sidebar from "./Sidebar";
import "./Dashboard.css"; // Ensure correct file name

// TODO:  ayusin aralin
//! ALERT WAG ASA SA AI
const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [orders, setOrders] = useState([]); // State to hold orders
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    status: 'Pending',
    items: [],
    total: 0
  });

  // Fetch orders from backend when component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
        const response = await fetch("http://localhost:1337/fetchorders");
        const data = await response.json();
        setOrders(data.data || []); // Ensure it's always an array
    } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]); // Prevent undefined errors
    }
};


  // Handle adding a new order
  const addOrder = async () => {
    try {
      const response = await fetch("http://localhost:1337/addorder", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder) // Send the new order data
      });

      if (response.ok) {
        // After successfully adding, re-fetch the orders
        fetchOrders();
      } else {
        console.error("Error adding order");
      }
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  const changeStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:1337/updateOrderStatus/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }) // Send new status in the request body
      });
  
      if (response.ok) {
        // After updating the status, re-fetch the orders to ensure the data is fresh
        fetchOrders();
      } else {
        console.error("Error updating order status: Response not OK");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  

  return (
    <div className="dashboard-container">
      <Sidebar />
      <Box sx={{ flexGrow: 1 }} className="dashboard-content">
        {/* Top Bar */}
        <AppBar position="static" color="default" sx={{ mb: 2, p: 1 }} className="top-bar">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }} className="dashboard-title">
              Dashboard
            </Typography>
            <InputBase
              placeholder="Search…"
              sx={{ ml: 2, flex: 1, border: "1px solid gray", borderRadius: 1, p: 1 }}
              className="search-input"
            />
            <IconButton className="search-box">
              <SearchIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Tabs */}
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} className="dashboard-tabs">
          <Tab label="Overview" />
          <Tab label="Analytics" disabled />
          <Tab label="Reports" disabled />
          <Tab label="Notifications" disabled />
        </Tabs>

        {/* Metrics Cards */}
        <Grid container spacing={2} sx={{ mt: 2 }} className="metrics-grid">
          {[ 
            { title: "Total Orders", value: orders.length },
            { title: "Pending Orders", value: orders.filter(order => order.status === "Pending").length },
            { title: "Completed Orders", value: orders.filter(order => order.status === "Completed").length },
            { title: "Active Customers", value: new Set(orders.map(order => order.customerName)).size }
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} className="metric-card">
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" color="textSecondary" className="metric-title">
                    {item.title}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" className="metric-value">
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Overview & Recent Sales */}
        <Grid container spacing={2} sx={{ mt: 2 }} className="overview-grid">
          <Grid item xs={12} md={8}>
            <Card className="overview-card">
              <CardContent>
                <Typography variant="h6">Overview</Typography>
                <OrderBarChart orders={orders} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className="overview-card">
              <CardContent>
                <Typography variant="h6">Recent Orders</Typography>
                {orders.length > 0 ? (
                  orders.slice(-5).map((order, index) => (
                    <Typography key={index} variant="body2">
                      {order.customerName} - {order.status}
                      {/* Button to change status */}
                      <Button
                        variant="outlined"
                        onClick={() => changeStatus(order.id, "Completed")}
                      >
                        Mark as Completed
                      </Button>
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2">No recent orders.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Add New Order Button */}
        <Box sx={{ mt: 2, textAlign: "right" }} className="download-btn-container">
          <Button variant="contained" onClick={addOrder} startIcon={<DownloadIcon />}>Add Order</Button>
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
