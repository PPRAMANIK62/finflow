"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import TransactionForm from "./transaction-form";

const AddTransaction = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>Add Transaction</Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>
              Add the details of your transaction
            </DialogDescription>
          </DialogHeader>
          <TransactionForm
            onComplete={() => {
              setIsDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddTransaction;
