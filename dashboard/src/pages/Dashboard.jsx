import { useState, useEffect } from "react";
import { 
  Box, Typography, Button, Tabs, Tab, Card, CardContent, 
  AppBar, Toolbar, InputBase, IconButton, Chip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import OrderBarChart from "./BarChart";
import Sidebar from "./Sidebar";
import "./Dashboard.css";

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    status: 'Pending',
    items: [],
    total: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:1337/fetchorder");
      const data = await response.json();
      setOrders(data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  const addOrder = async () => {
    try {
      const response = await fetch("http://localhost:1337/addorder", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });

      if (response.ok) {
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
        body: JSON.stringify({ status: newStatus })
      });
  
      if (response.ok) {
        fetchOrders();
      } else {
        console.error("Error updating order status: Response not OK");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  
  // Get recent orders sorted by most recent first
  const recentOrders = [...orders].slice(-5).reverse();

  // Define the metric items for cleaner rendering
  const metricItems = [
    { title: "Total Orders", value: orders.length },
    { title: "Pending Orders", value: orders.filter(order => order.status === "Pending").length },
    { title: "Completed Orders", value: orders.filter(order => order.status === "Completed").length },
    { title: "Active Customers", value: new Set(orders.map(order => order.customerName)).size }
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <Box sx={{ flexGrow: 1 }} className="dashboard-content">
        {/* Top Bar */}
        <div className="top-bar">
          <Toolbar>
            <Typography variant="h6" className="dashboard-title">
              Order Management Dashboard
            </Typography>
            <Box>
              <InputBase
                placeholder="Search orders..."
                className="search-input"
              />
              <IconButton className="search-box">
                <SearchIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </div>

        {/* Tabs */}
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          className="dashboard-tabs"
          TabIndicatorProps={{
          }}
        >
          <Tab label="Overview" />
          <Tab label="Analytics" disabled />
          <Tab label="Reports" disabled />
          <Tab label="Notifications" disabled />
        </Tabs>

        {/* Metrics Cards */}
        <div className="metrics-grid">
          {metricItems.map((item, index) => (
            <div className="metric-card" key={index}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" className="metric-title">
                    {item.title}
                  </Typography>
                  <Typography variant="h4" className="metric-value">
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Overview & Recent Sales */}
        <div className="overview-grid">
          <Card>
            <CardContent>
              <Typography variant="h6">Sales Overview</Typography>
              <OrderBarChart orders={orders} />
            </CardContent>
          </Card>
          
          <Card className="overview-card">
            <CardContent>
              <Typography variant="h6">Recent Orders</Typography>
              {recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <div key={index} className="recent-order-item">
                    <div>
                      <Typography variant="body2" className="recent-order-name">
                        {order.customerName}
                      </Typography>
                      <Chip 
                        label={order.status} 
                        size="small"
                        className={`status-badge status-${order.status.toLowerCase()}`}
                      />
                    </div>
                    {order.status === "Pending" && (
                      <Button
                        variant="text"
                        size="small"
                        color="primary"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => changeStatus(order.id, "Completed")}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <Typography variant="body2" sx={{ py: 2, textAlign: 'center', color: '#64748b' }}>
                  No recent orders.
                </Typography>
              )}
            </CardContent>
          </Card>
        </div>

      </Box>
    </div>
  );
};

export default Dashboard;