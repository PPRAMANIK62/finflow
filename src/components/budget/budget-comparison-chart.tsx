"use client";

import { useTransactions } from "@/contexts/transaction-context";
import { compareBudgetVsActual, formatCurrency } from "@/lib/helpers";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

const BudgetComparisonChart = () => {
  const { transactions, budgets } = useTransactions();

  const comparisonData = compareBudgetVsActual(transactions, budgets);

  // Limit to top 5 categories with budgets for better visualization
  const topCategories = comparisonData
    .filter((item) => item.budget > 0)
    .slice(0, 5);

  // Prepare data for the bar chart
  const chartData = topCategories.map((item) => ({
    name: item.category,
    Budget: item.budget,
    Spent: item.spent,
  }));

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Budget vs. Actual Spending</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="space-y-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend />
                  <Bar dataKey="Budget" fill="#8884d8" />
                  <Bar dataKey="Spent" fill="#82ca9d">
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.Spent > entry.Budget ? "#ff6b6b" : "#82ca9d"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {topCategories.map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-sm">
                      {formatCurrency(item.spent)} of{" "}
                      {formatCurrency(item.budget)}
                    </span>
                  </div>
                  <Progress
                    value={item.percentSpent}
                    className={item.overBudget ? "bg-red-200" : "bg-gray-200"}
                    color={item.overBudget ? "bg-red-600" : ""}
                  />
                  <div className="text-right text-xs">
                    {item.percentSpent.toFixed(0)}% of budget
                    {item.overBudget && (
                      <span className="ml-1 text-red-500">Over budget!</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500">
            No budget data available. Set budgets to see comparison.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetComparisonChart;
