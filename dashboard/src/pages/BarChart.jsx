import React from "react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const OrderBarChart = ({ orders }) => {
  const data = [
    { status: "Pending", count: orders.filter(order => order.status === "Pending").length },
    { status: "Processing", count: orders.filter(order => order.status === "Processing").length },
    { status: "Completed", count: orders.filter(order => order.status === "Completed").length }
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
