import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatBot from "./ChatBot";
import "../styles/OrderStatus.css";
import axios from "axios";

function OrderStatus() {
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(() => {
    return (
      location.state?.order ||
      JSON.parse(localStorage.getItem("selectedOrder")) ||
      null
    );
  });

  const [status, setStatus] = useState(order?.status || "Pending");

  useEffect(() => {
    if (!order) {
      console.warn("No order selected.");
    }
  }, [order]);

  if (!order) {
    return <h2 className="no-order">No Order Selected</h2>;
  }

  const handleSave = async () => {
    const updatedOrder = { ...order, status };
    const orderId = order.orderId || order.id;
  
    try {
      const response = await axios.put(`http://localhost:1337/updateorder/${orderId}`, updatedOrder);
      console.log("Order update successful:", response.data);
      
      navigate("/home", { state: { updatedOrder: response.data } });
    } catch (error) {
      console.error("Order update failed:", error);
  
      const serverMessage = error.response?.data?.message || error.message || "Unknown error";
      alert("Failed to update order. Reason: " + serverMessage);
    }
  };
  
  const printReceipt = () => {
    const style = document.createElement('style');
    document.head.appendChild(style);
    window.print();
    setTimeout(() => {
      document.head.removeChild(style);
    }, 1000);
  };
  
  return (
    <div className="orderPage">
      <Sidebar />
      <div className="orderContainer">
        <div className="header">
          <h2>Order Details</h2>
          <p>
            <a href="/home">Dashboard</a> / <span>Orders</span> / Order Details
          </p>
        </div>

        <div className="info">
          <div className="left">
            <div>
              <h3>Laundry Management System</h3>
              <p>
                Aglipay Street, Bayombong.
                <br />
                Nueva Vizcaya - 3700
                <br />
                Bayombong, Nueva Vizcaya
              </p>
              <p>
                hed-mwpajarillo@smu.edu.ph
                <br />
                (+63) 939-737-4249
              </p>
            </div>
            <div>
              <h3>#ORD-{(order?.id || order?.orderId)?.toString().padStart(4, "0")}</h3>
              <p>
                <strong>Invoice To:</strong> {order.customerName} <br />
                <strong>Amount to Pay:</strong> ₱{order.amountToPay}
              </p>
            </div>
          </div>

          <div className="right">
            <div className="addons">
              <h4>Add-ons</h4>
              <p>Delivery: ₱5</p>
            </div>
            <div className="payment">
              <h4>Payments</h4>
              <p>₱{order.amountToPay}</p>
              <p>{order.date} [cash]</p>
            </div>
            <div className="payActions">
              <button className="add">Add Payment</button>
              <button className="print" onClick={printReceipt}>Print Invoice</button>
              <button className="download">Download PDF</button>
              <button className="save" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div className="orderInfo">
          <p>
            <strong>Order Date:</strong> {order.date}
          </p>
          <p>
            <strong>Delivery Date:</strong> {order.date}
          </p>
          <div className="status">
            <label>Status:</label>
            <select
              className="statusDropdown"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Processing">Processing</option>
              <option value="Ready to be Picked Up">Ready to be Picked Up</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="tableContainer">
          <table className="orderTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Service Name</th>
                <th>Weight (kg)</th>
                <th>Amount ($)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{order.orderId}</td>
                <td>{order.serviceType}</td>
                <td>{order.laundryWeight} kg</td>
                <td>${order.amountToPay}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <ChatBot />
    </div>
  );
}

export default OrderStatus;