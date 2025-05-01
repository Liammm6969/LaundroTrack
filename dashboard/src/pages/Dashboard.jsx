import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import OrderBarChart from "./BarChart";
import Sidebar from "./Sidebar";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [orders, setOrders] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch orders when the component is mounted
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:1337/fetchorder");
      const data = await response.json();
      console.log("Fetched orders:", data); // Log data to verify the structure
      
      // Check if data is an array directly or needs to be accessed differently
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data.orders && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        console.error("Unexpected data format:", data);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };
  
  // Get recent orders sorted by most recent first
  const recentOrders = [...orders].slice(-5).reverse();

  // Define the metric items for cleaner rendering - improved with case-insensitive matching
  const metricItems = [
    { title: "Total Orders", value: orders.length },
    { 
      title: "Pending Orders", 
      value: orders.filter(order => 
        order.status && 
        (order.status.toLowerCase() === "pending" || 
         order.status.toLowerCase() === "processing")
      ).length 
    },
    { 
      title: "Completed Orders", 
      value: orders.filter(order => 
        order.status && order.status.toLowerCase() === "completed"
      ).length 
    },
    { 
      title: "Active Customers", 
      value: new Set(
        orders
          .filter(order => order.customerName)
          .map(order => order.customerName)
      ).size 
    }
  ];
  
  // Function to update order status
  const changeStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:1337/updatestatus/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        // Refresh orders after status change
        fetchOrders();
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Toggle sidebar visibility
  const handleSidebarToggle = (isOpen) => {
    setSidebarOpen(isOpen);
  };

  // Debug function to check what's in the orders
  useEffect(() => {
    if (orders.length > 0) {
      console.log("Orders loaded, sample order:", orders[0]);
      console.log("Available statuses:", [...new Set(orders.map(order => order.status))]);
    }
  }, [orders]);

  return (
    <div className="app-container">
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="dashboard-container">
          <div className="top-bar">
            <div className="dashboard-title">
              Order Management Dashboard
            </div>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search orders..."
                className="search-input"
              />
              <button className="search-button">
                <SearchIcon />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="dashboard-tabs">
            <button 
              className={`tab-button ${tabValue === 0 ? 'active' : ''}`}
              onClick={() => setTabValue(0)}
            >
              Overview
            </button>
            <button 
              className={`tab-button ${tabValue === 1 ? 'active' : ''}`}
              onClick={() => setTabValue(1)}
              disabled
            >
              Analytics
            </button>
            <button 
              className={`tab-button ${tabValue === 2 ? 'active' : ''}`}
              onClick={() => setTabValue(2)}
              disabled
            >
              Reports
            </button>
            <button 
              className={`tab-button ${tabValue === 3 ? 'active' : ''}`}
              onClick={() => setTabValue(3)}
              disabled
            >
              Notifications
            </button>
          </div>

          {/* Metrics Cards */}
          <div className="metrics-grid">
            {metricItems.map((item, index) => (
              <div className="metric-card" key={index}>
                <div className="card-content">
                  <div className="metric-title">
                    {item.title}
                  </div>
                  <div className="metric-value">
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Overview & Recent Sales */}
          <div className="overview-grid">
            <div className="chart-card">
              <div className="card-header">
                Sales Overview
              </div>
              <div className="card-body">
                <OrderBarChart orders={orders} />
              </div>
            </div>
            
            <div className="overview-card">
              <div className="card-header">
                Recent Orders
              </div>
              <div className="card-body">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order, index) => (
                    <div key={index} className="recent-order-item">
                      <div className="order-info">
                        <div className="recent-order-name">
                          {order.customerName}
                        </div>
                        <div className={`status-badge status-${order.status?.toLowerCase()}`}>
                          {order.status}
                        </div>
                      </div>
                      {order.status === "Processing" && (
                        <button
                          className="complete-button"
                          onClick={() => changeStatus(order.orderId, "Completed")}
                        >
                          <CheckCircleIcon className="button-icon" />
                          Complete
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-orders-message">
                    No recent orders.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;