"use client";

import type { Transaction, TransactionFormData } from "@/lib/types";
import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: TransactionFormData) => void;
  editTransaction: (id: string, transaction: TransactionFormData) => void;
  deleteTransaction: (id: string) => void;
  isEditing: string | null;
  setIsEditing: (id: string | null) => void;
  currentEditTransaction: Transaction | null;
  budgets: Record<string, number>;
  setBudget: (category: string, amount: number) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider",
    );
  }
  return context;
};

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize with some sample data including categories
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    // Check if we have transactions in localStorage
    const savedTransactions = localStorage.getItem("transactions");
    return savedTransactions
      ? (JSON.parse(savedTransactions) as Transaction[])
      : [];
  });

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [currentEditTransaction, setCurrentEditTransaction] =
    useState<Transaction | null>(null);

  const [budgets, setBudgets] = useState<Record<string, number>>(() => {
    // Load budgets from localStorage or set defaults
    const savedBudgets = localStorage.getItem("budgets");
    return savedBudgets
      ? (JSON.parse(savedBudgets) as Record<string, number>)
      : {};
  });

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Save budgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  // Update currentEditTransaction whenever isEditing changes
  useEffect(() => {
    if (isEditing) {
      const transaction = transactions?.find((t) => t.id === isEditing) ?? null;
      setCurrentEditTransaction(transaction);
    } else {
      setCurrentEditTransaction(null);
    }
  }, [isEditing, transactions]);

  const addTransaction = (transaction: TransactionFormData) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const editTransaction = (id: string, transaction: TransactionFormData) => {
    setTransactions(
      transactions.map((t) => (t.id === id ? { ...transaction, id } : t)),
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const setBudget = (category: string, amount: number) => {
    setBudgets({
      ...budgets,
      [category]: amount,
    });
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        editTransaction,
        deleteTransaction,
        isEditing,
        setIsEditing,
        currentEditTransaction,
        budgets,
        setBudget,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
