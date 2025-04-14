"use client";

import CategoryBreakdown from "@/components/category/category-breakdown";
import Header from "@/components/header";
import RecentTransactions from "@/components/transaction/recent-transactions";
import TransactionForm from "@/components/transaction/transaction-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionProvider } from "@/contexts/transaction-context";

export default function HomePage() {
  return (
    <TransactionProvider>
      <div className="min-h-screen p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <Header />

          <Tabs defaultValue="dashboard" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="budgets">Budget Management</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <TransactionForm />
                </div>
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <RecentTransactions />
                    <CategoryBreakdown />
                  </div>
                </div>
              </div>

              <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* <ExpensesChart /> */}
                {/* <CategoryPieChart /> */}
              </div>

              <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* <BudgetComparisonChart /> */}
                {/* <SpendingInsights /> */}
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              {/* <TransactionList /> */}
            </TabsContent>

            <TabsContent value="budgets">
              <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* <BudgetManager /> */}
                {/* <SpendingInsights /> */}
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* <BudgetComparisonChart /> */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TransactionProvider>
  );
}
