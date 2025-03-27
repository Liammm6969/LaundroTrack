import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", value: 3000 },
  { name: "Feb", value: 6000 },
  { name: "Mar", value: 3000 },
  { name: "Apr", value: 2000 },
  { name: "May", value: 5000 },
  { name: "Jun", value: 4500 },
  { name: "Jul", value: 3800 },
  { name: "Aug", value: 3200 },
  { name: "Sep", value: 4000 },
  { name: "Oct", value: 1500 },
  { name: "Nov", value: 2800 },
  { name: "Dec", value: 1000 },
];

export default function OverviewChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" stroke="#8884d8" />
        <YAxis stroke="#8884d8" />
        <Tooltip />
        <Bar dataKey="value" fill="#82ca9d" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
}