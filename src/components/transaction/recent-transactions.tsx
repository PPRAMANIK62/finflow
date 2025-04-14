"use client";

import { useTransactions } from "@/contexts/transaction-context";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const RecentTransactions = () => {
  const { transactions } = useTransactions();

  // Get the 5 most recent transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="flex items-center">
                  <div
                    className={`mr-3 rounded-full p-2 ${transaction.isExpense ? "bg-red-100" : "bg-green-100"}`}
                  >
                    {transaction.isExpense ? (
                      <ArrowDownCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <ArrowUpCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{formatDate(transaction.date)}</span>
                      {transaction.category && (
                        <>
                          <span>•</span>
                          <span>{transaction.category}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <span
                  className={`font-medium ${transaction.isExpense ? "text-red-600" : "text-green-600"}`}
                >
                  {transaction.isExpense ? "-" : "+"}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-gray-500">
              No transactions yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
