import React from "react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const OrderBarChart = ({ orders }) => {
  const data = [
    { status: "Processing", count: orders.filter(order => order.status === "Processing").length },
    { status: "Ready to be Picked Up", count: orders.filter(order => order.status === "Ready to be Picked Up").length },
    { status: "Completed", count: orders.filter(order => order.status === "Completed").length },
    { status: "Cancelled", count: orders.filter(order => order.status === "Cancelled").length }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data}>
        <XAxis dataKey="status" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default OrderBarChart;
