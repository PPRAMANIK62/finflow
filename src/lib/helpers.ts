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

// Get current month's expenses by category
export const getCurrentMonthExpensesByCategory = (
  transactions: Transaction[],
) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const expensesByCategory: Record<string, number> = {};

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const isCurrentMonth =
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear;

    if (transaction.isExpense && isCurrentMonth && transaction.category) {
      expensesByCategory[transaction.category] ??= 0;
      expensesByCategory[transaction.category]! += transaction.amount;
    }
  });

  return expensesByCategory;
};

// Compare budget vs actual spending
export const compareBudgetVsActual = (
  transactions: Transaction[],
  budgets: Record<string, number>,
) => {
  const currentMonthExpenses = getCurrentMonthExpensesByCategory(transactions);

  // Create comparison data for chart
  return Object.entries(budgets)
    .map(([category, budgetAmount]) => {
      const spent = currentMonthExpenses[category] ?? 0;
      const remaining = Math.max(0, budgetAmount - spent);
      const percentSpent = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

      return {
        category,
        budget: budgetAmount,
        spent,
        remaining,
        percentSpent: Math.min(percentSpent, 100), // Cap at 100%
        overBudget: spent > budgetAmount,
      };
    })
    .sort((a, b) => b.percentSpent - a.percentSpent); // Sort by percentage spent
};

// Generate spending insights
export const generateSpendingInsights = (
  transactions: Transaction[],
  budgets: Record<string, number>,
) => {
  const currentMonthExpenses = getCurrentMonthExpensesByCategory(transactions);
  const budgetComparison = compareBudgetVsActual(transactions, budgets);

  const insights = [];

  // Check for categories over budget
  const overBudgetCategories = budgetComparison.filter(
    (item) => item.overBudget,
  );
  if (overBudgetCategories.length > 0) {
    insights.push({
      type: "warning",
      title: "Budget Alert",
      message: `You're over budget in ${overBudgetCategories.length} ${
        overBudgetCategories.length === 1 ? "category" : "categories"
      }: ${overBudgetCategories.map((c) => c.category).join(", ")}.`,
    });
  }

  // Check for categories close to budget (>= 80%)
  const nearBudgetCategories = budgetComparison.filter(
    (item) => !item.overBudget && item.percentSpent >= 80,
  );
  if (nearBudgetCategories.length > 0) {
    insights.push({
      type: "info",
      title: "Budget Reminder",
      message: `You're approaching your budget limit in: ${nearBudgetCategories
        .map((c) => c.category)
        .join(", ")}.`,
    });
  }

  // Find highest spending category
  const highestSpendingCategory = Object.entries(currentMonthExpenses).sort(
    (a, b) => b[1] - a[1],
  )[0];
  if (highestSpendingCategory) {
    insights.push({
      type: "info",
      title: "Spending Pattern",
      message: `Your highest spending category this month is ${highestSpendingCategory[0]} (${formatCurrency(highestSpendingCategory[1])}).`,
    });
  }

  // Check for savings
  const wellBelowBudgetCategories = budgetComparison.filter(
    (item) => item.percentSpent < 50 && item.budget > 0,
  );
  if (wellBelowBudgetCategories.length > 0) {
    insights.push({
      type: "success",
      title: "Savings Opportunity",
      message: `You're well under budget in ${wellBelowBudgetCategories.length} ${
        wellBelowBudgetCategories.length === 1 ? "category" : "categories"
      }, great job saving money!`,
    });
  }

  return insights;
};
