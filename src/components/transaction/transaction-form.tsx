"use client";

import { useTransactions } from "@/contexts/transaction-context";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type TransactionFormData,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Minus, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

const transactionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  date: z.date({
    required_error: "Please select a date",
  }),
  description: z.string().min(3, "Description must be at least 3 characters"),
  isExpense: z.boolean(),
  category: z.string().min(1, "Please select a category"),
});

interface Props {
  onComplete?: () => void;
}

const TransactionForm = ({ onComplete }: Props) => {
  const {
    addTransaction,
    editTransaction,
    isEditing,
    currentEditTransaction,
    setIsEditing,
  } = useTransactions();

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: currentEditTransaction?.amount ?? 0,
      description: currentEditTransaction?.description ?? "",
      date: currentEditTransaction?.date
        ? new Date(currentEditTransaction.date)
        : new Date(),
      isExpense: currentEditTransaction?.isExpense ?? true,
      category:
        currentEditTransaction?.category ??
        (currentEditTransaction?.isExpense
          ? EXPENSE_CATEGORIES[0]
          : INCOME_CATEGORIES[0]),
    },
  });

  // Watch for expense type to update available categories
  const isExpense = form.watch("isExpense");
  const categories = isExpense ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const onSubmit = (data: TransactionFormData) => {
    if (isEditing && currentEditTransaction) {
      editTransaction(currentEditTransaction.id, data);
      toast.success("Transaction updated");
      // Clear editing state
      setIsEditing(null);
    } else {
      addTransaction(data);
      toast.success("Transaction added");
    }

    onComplete?.();

    // Reset form
    form.reset({
      amount: 0,
      date: new Date(),
      description: "",
      isExpense: true,
      category: "",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="isExpense"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Transaction Type</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  value={field.value ? "expense" : "income"}
                  onValueChange={(value) => {
                    if (value) {
                      field.onChange(value === "expense");
                      // Reset category when transaction type changes
                      form.setValue("category", "");
                    }
                  }}
                  className="justify-start rounded-md border p-1"
                >
                  <ToggleGroupItem
                    value="expense"
                    className="flex items-center gap-1 data-[state=on]:bg-red-100 data-[state=on]:text-red-600"
                  >
                    <Minus className="h-4 w-4" />
                    Expense
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="income"
                    className="flex items-center gap-1 data-[state=on]:bg-green-100 data-[state=on]:text-green-600"
                  >
                    <Plus className="h-4 w-4" />
                    Income
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  step="10"
                  min="0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "cursor-pointer pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter transaction description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update" : "Add"} Transaction
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransactionForm;
