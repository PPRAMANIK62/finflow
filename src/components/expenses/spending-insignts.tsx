"use client";

import { useTransactions } from "@/contexts/transaction-context";
import { generateSpendingInsights } from "@/lib/helpers";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const SpendingInsights = () => {
  const { transactions, budgets } = useTransactions();

  const insights = generateSpendingInsights(transactions, budgets);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getInsightBackground = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "success":
        return "bg-green-50 border-green-200";
      case "info":
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Spending Insights</CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`rounded-lg border p-4 ${getInsightBackground(insight.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div>
                    <h4 className="mb-1 font-medium">{insight.title}</h4>
                    <p className="text-sm text-gray-600">{insight.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500">
            No insights available. Add transactions and set budgets to see
            insights.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingInsights;
