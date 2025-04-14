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
