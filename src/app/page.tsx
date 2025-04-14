"use client";

import BudgetComparisonChart from "@/components/budget/budget-comparison-chart";
import BudgetManager from "@/components/budget/budget-manager";
import CategoryBreakdown from "@/components/category/category-breakdown";
import CategoryPieChart from "@/components/category/category-pie-chart";
import ExpensesChart from "@/components/expenses/expenses-chart";
import SpendingInsights from "@/components/expenses/spending-insignts";
import Header from "@/components/header";
import AddTransaction from "@/components/transaction/add-transaction";
import RecentTransactions from "@/components/transaction/recent-transactions";
import TransactionList from "@/components/transaction/transaction-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionProvider } from "@/contexts/transaction-context";

export default function HomePage() {
  return (
    <TransactionProvider>
      <div className="min-h-screen p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <Header />

          <Tabs defaultValue="dashboard" className="mb-8">
            <div className="flex justify-between">
              <TabsList className="mb-6">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="budgets">Budget Management</TabsTrigger>
              </TabsList>

              <AddTransaction />
            </div>

            <TabsContent value="dashboard">
              <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <RecentTransactions />
                    <CategoryBreakdown />
                  </div>
                </div>
              </div>

              <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ExpensesChart />
                <CategoryPieChart />
              </div>

              <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <BudgetComparisonChart />
                <SpendingInsights />
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <TransactionList />
            </TabsContent>

            <TabsContent value="budgets">
              <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <BudgetManager />
                <SpendingInsights />
              </div>

              <div className="grid grid-cols-1 gap-6">
                <BudgetComparisonChart />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TransactionProvider>
  );
}
