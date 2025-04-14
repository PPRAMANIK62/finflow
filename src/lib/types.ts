export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  isExpense: boolean;
  category?: string;
}

export type TransactionFormData = Omit<Transaction, "id">;
