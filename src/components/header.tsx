"use client";

import { useTransactions } from "@/contexts/transaction-context";
import {
  calculateBalance,
  calculateTotalExpenses,
  calculateTotalIncome,
  formatCurrency,
} from "@/lib/helpers";
import { ArrowDownCircle, ArrowUpCircle, DollarSign } from "lucide-react";
// import { ModeToggle } from "./mode-toggle";
import { Card, CardContent } from "./ui/card";

const Header = () => {
  const { transactions } = useTransactions();

  const balance = calculateBalance(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const totalIncome = calculateTotalIncome(transactions);

  return (
    <div className="mb-8 w-full">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Personal Finance Tracker</h1>
        {/* <ModeToggle /> */}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="shadow-md">
          <CardContent className="flex items-center p-6">
            <div className="mr-4 rounded-full bg-blue-100 p-3 dark:bg-blue-600">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-100" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Current Balance
              </p>
              <h3
                className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {formatCurrency(balance)}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="flex items-center p-6">
            <div className="mr-4 rounded-full bg-green-100 p-3 dark:bg-green-600">
              <ArrowUpCircle className="h-6 w-6 text-green-600 dark:text-green-100" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Income</p>
              <h3 className="text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="flex items-center p-6">
            <div className="mr-4 rounded-full bg-red-100 p-3 dark:bg-red-600">
              <ArrowDownCircle className="h-6 w-6 text-red-600 dark:text-red-100" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Expenses
              </p>
              <h3 className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Header;
