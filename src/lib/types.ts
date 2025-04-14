export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  isExpense: boolean;
  category: string;
}

export type TransactionFormData = Omit<Transaction, "id">;

export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Shopping",
  "Housing",
  "Transportation",
  "Utilities",
  "Healthcare",
  "Entertainment",
  "Education",
  "Personal Care",
  "Travel",
  "Gifts & Donations",
  "Other",
];

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investments",
  "Gifts",
  "Refunds",
  "Other",
];
