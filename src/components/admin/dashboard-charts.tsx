"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { useTheme } from "next-themes";

const data = [
  { name: "Lun", revenue: 4000, orders: 24 },
  { name: "Mar", revenue: 3000, orders: 13 },
  { name: "Mié", revenue: 2000, orders: 98 },
  { name: "Jue", revenue: 2780, orders: 39 },
  { name: "Vie", revenue: 1890, orders: 48 },
  { name: "Sáb", revenue: 2390, orders: 38 },
  { name: "Dom", revenue: 3490, orders: 43 },
];

export function RevenueChart() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#84a98c" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#84a98c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#2a2a2a" : "#e5e5e5"} vertical={false} />
          <XAxis dataKey="name" stroke={isDark ? "#666" : "#888"} fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke={isDark ? "#666" : "#888"} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `S/${value}`} />
          <Tooltip
            contentStyle={{ 
              backgroundColor: isDark ? "#1a1a1a" : "#ffffff", 
              borderColor: isDark ? "#333" : "#e5e5e5", 
              borderRadius: "8px", 
              color: isDark ? "#fff" : "#1a1a1a" 
            }}
            itemStyle={{ color: "#84a98c" }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#84a98c" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OrdersChart() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#2a2a2a" : "#e5e5e5"} vertical={false} />
          <XAxis dataKey="name" stroke={isDark ? "#666" : "#888"} fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke={isDark ? "#666" : "#888"} fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ 
              backgroundColor: isDark ? "#1a1a1a" : "#ffffff", 
              borderColor: isDark ? "#333" : "#e5e5e5", 
              borderRadius: "8px", 
              color: isDark ? "#fff" : "#1a1a1a" 
            }}
            cursor={{ fill: isDark ? "#2a2a2a" : "#f5f5f5" }}
          />
          <Bar dataKey="orders" fill="#e9c46a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
