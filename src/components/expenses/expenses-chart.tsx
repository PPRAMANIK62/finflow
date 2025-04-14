"use client";

import { useTransactions } from "@/contexts/transaction-context";
import { groupTransactionsByMonth } from "@/lib/helpers";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const ExpensesChart = () => {
  const { transactions } = useTransactions();
  const chartData = groupTransactionsByMonth(transactions);

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}k`;
    }
    return `₹${value}`;
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
  }) => {
    if (active && payload?.length) {
      return (
        <div className="rounded border bg-white p-3 shadow">
          <p className="font-medium">{label}</p>
          <p className="font-medium text-red-600">
            ${payload[0]?.value.toFixed(2)}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="h-[400px] bg-white shadow-md">
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={formatYAxis}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="amount"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            No expense data to display
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpensesChart;
