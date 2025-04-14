import { format } from "date-fns";
import type { Transaction } from "./types";

// Format currency with 2 decimal places
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

// Calculate total balance
export const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    return transaction.isExpense
      ? total - transaction.amount
      : total + transaction.amount;
  }, 0);
};

// Calculate total expenses
export const calculateTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) => t.isExpense)
    .reduce((total, transaction) => total + transaction.amount, 0);
};

// Calculate total income
export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) => !t.isExpense)
    .reduce((total, transaction) => total + transaction.amount, 0);
};

// Format date in a readable format
export const formatDate = (date: Date): string => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return format(date, "MMM dd, yyyy");
};

// Group transactions by month for the chart
export const groupTransactionsByMonth = (transactions: Transaction[]) => {
  const expensesByMonth: Record<string, number> = {};

  transactions.forEach((transaction) => {
    if (transaction.isExpense) {
      const date = new Date(transaction.date);
      const monthKey = format(date, "MMM yyyy");

      expensesByMonth[monthKey] ??= 0;
      expensesByMonth[monthKey] += transaction.amount;
    }
  });

  // Convert to array for recharts
  return Object.entries(expensesByMonth)
    .map(([month, amount]) => ({
      month,
      amount,
    }))
    .sort((a, b) => {
      // Sort by date (recent months first)
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 6)
    .reverse(); // Get last 6 months and make chronological
};
