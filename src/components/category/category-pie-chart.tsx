"use client";

import { useTransactions } from "@/contexts/transaction-context";
import { formatCurrency } from "@/lib/helpers";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const COLORS = [
  "#8884d8",
  "#83a6ed",
  "#8dd1e1",
  "#82ca9d",
  "#a4de6c",
  "#d0ed57",
  "#ffc658",
  "#ff8042",
  "#ff6b6b",
  "#dc3545",
  "#fd7e14",
  "#6f42c1",
];

const CategoryPieChart = () => {
  const { transactions } = useTransactions();

  // Calculate expenses by category
  const getCategoryData = () => {
    const expensesByCategory: Record<string, number> = {};

    transactions.forEach((transaction) => {
      if (transaction.isExpense && transaction.category) {
        expensesByCategory[transaction.category] ??= 0;
        expensesByCategory[transaction.category]! += transaction.amount;
      }
    });

    // Convert to array for recharts
    return Object.entries(expensesByCategory)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value); // Sort by value descending
  };

  const data = getCategoryData();

  // Custom tooltip for the pie chart
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { name: string; value: number }[];
  }) => {
    if (active && payload?.length) {
      return (
        <div className="rounded border bg-white p-2 shadow-sm">
          <p className="font-medium">{payload[0]!.name}</p>
          <p className="text-gray-700">{formatCurrency(payload[0]!.value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              No expense data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;
