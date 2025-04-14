"use client";

import { useTransactions } from "@/contexts/transaction-context";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { ArrowDown, ArrowUp, Edit, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import TransactionForm from "./transaction-form";

const TransactionList = () => {
  const { transactions, deleteTransaction, setIsEditing, isEditing } =
    useTransactions();

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      deleteTransaction(confirmDelete);
      setConfirmDelete(null);
      toast.success("Transaction deleted");
    }
  };

  const handleEdit = (id: string) => {
    setIsEditing(id);
    setIsDialogOpen(true);
  };

  const toggleSort = (field: "date" | "amount") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    } else {
      return sortDirection === "asc"
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
  });

  return (
    <>
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Transaction History</span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  className="h-8 pl-8 text-sm"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-2 py-2 text-left font-medium text-gray-500">
                    DESCRIPTION
                  </th>
                  <th
                    className="cursor-pointer px-2 py-2 text-left font-medium text-gray-500"
                    onClick={() => toggleSort("date")}
                  >
                    <div className="flex items-center">
                      DATE
                      {sortBy === "date" &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ArrowDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer px-2 py-2 text-right font-medium text-gray-500"
                    onClick={() => toggleSort("amount")}
                  >
                    <div className="flex items-center justify-end">
                      AMOUNT
                      {sortBy === "amount" &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ArrowDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th className="px-2 py-2 text-right font-medium text-gray-500">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.length > 0 ? (
                  sortedTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-2 py-3">
                        <div className="flex items-center">
                          <div
                            className={`mr-2 h-2 w-2 rounded-full ${transaction.isExpense ? "bg-red-500" : "bg-green-500"}`}
                          />
                          {transaction.description}
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        {formatDate(new Date(transaction.date))}
                      </td>
                      <td
                        className={`px-2 py-3 text-right font-medium ${transaction.isExpense ? "text-red-600" : "text-green-600"}`}
                      >
                        {transaction.isExpense ? "- " : "+ "}
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-2 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(transaction.id)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setConfirmDelete(transaction.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-500">
                      {searchTerm
                        ? "No transactions found matching your search."
                        : "No transactions yet. Add your first transaction!"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Dialog
            open={!!confirmDelete}
            onOpenChange={(open) => !open && setConfirmDelete(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <p className="py-4">
                Are you sure you want to delete this transaction? This action
                cannot be undone.
              </p>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Update the details of your transaction
            </DialogDescription>
          </DialogHeader>
          {isEditing && (
            <TransactionForm
              onComplete={() => {
                setIsDialogOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionList;
