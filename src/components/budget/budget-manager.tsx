"use client";

import { useTransactions } from "@/contexts/transaction-context";
import { formatCurrency } from "@/lib/helpers";
import { EXPENSE_CATEGORIES } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

const BudgetManager = () => {
  const { budgets, setBudget } = useTransactions();

  const [editMode, setEditMode] = useState(false);
  const [tempBudgets, setTempBudgets] = useState<Record<string, number>>({});

  // Initialize tempBudgets when budgets change
  useEffect(() => {
    setTempBudgets({ ...budgets });
  }, [budgets]);

  const handleBudgetChange = (category: string, value: string) => {
    const amount = parseFloat(value);
    if (!isNaN(amount) && amount >= 0) {
      setTempBudgets({
        ...tempBudgets,
        [category]: amount,
      });
    }
  };

  const saveBudgets = () => {
    // Update all budgets
    Object.entries(tempBudgets).forEach(([category, amount]) => {
      setBudget(category, amount);
    });

    setEditMode(false);
    toast.success("Budget settings saved");
  };

  const cancelEdit = () => {
    setTempBudgets({ ...budgets });
    setEditMode(false);
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Monthly Budget Settings</CardTitle>
        {!editMode && (
          <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
            Edit Budgets
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {EXPENSE_CATEGORIES.map((category) => (
            <div key={category} className="flex items-center justify-between">
              <span className="font-medium">{category}</span>
              {editMode ? (
                <Input
                  type="number"
                  value={tempBudgets[category] ?? 0}
                  onChange={(e) => handleBudgetChange(category, e.target.value)}
                  className="w-32"
                  min="0"
                  step="10"
                />
              ) : (
                <span className="font-medium">
                  {formatCurrency(budgets[category] ?? 0)}
                </span>
              )}
            </div>
          ))}

          {editMode && (
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
              <Button onClick={saveBudgets}>Save Budgets</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetManager;
