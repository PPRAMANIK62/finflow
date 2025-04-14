"use client";

import { useTransactions } from "@/contexts/transaction-context";
import { formatCurrency } from "@/lib/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

const CategoryBreakdown = () => {
  const { transactions } = useTransactions();

  // Calculate the expenses by category
  const getCategoryData = () => {
    const expensesByCategory: Record<string, number> = {};
    let totalExpenses = 0;

    transactions.forEach((transaction) => {
      if (transaction.isExpense && transaction.category) {
        expensesByCategory[transaction.category] ??= 0;
        expensesByCategory[transaction.category]! += transaction.amount;
        totalExpenses += transaction.amount;
      }
    });

    // Convert to array and calculate percentages
    return {
      categories: Object.entries(expensesByCategory)
        .map(([name, value]) => ({
          name,
          value,
          percentage: totalExpenses > 0 ? (value / totalExpenses) * 100 : 0,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5), // Get top 5 categories
      totalExpenses,
    };
  };

  const { categories } = getCategoryData();

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Top Spending Categories</CardTitle>
      </CardHeader>
      <CardContent>
        {categories.length > 0 ? (
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-gray-600">
                    {formatCurrency(category.value)}
                  </span>
                </div>
                <Progress value={category.percentage} className="h-2" />
                <div className="text-right text-xs text-gray-500">
                  {category.percentage.toFixed(1)}% of total
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500">
            No expense data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryBreakdown;
