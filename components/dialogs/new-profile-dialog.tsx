"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import UserDetailsForm from "../user-details-form";
import { useState } from "react";

export default function NewProfileDialog({
  profileExists = true,
}: {
  profileExists: boolean;
}) {
  const [open, setOpen] = useState(!profileExists);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome!</AlertDialogTitle>
          <AlertDialogDescription>
            Fill out this form to complete your profile.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <UserDetailsForm onSubmitSuccess={() => setOpen(false)} />
      </AlertDialogContent>
    </AlertDialog>
  );
}
