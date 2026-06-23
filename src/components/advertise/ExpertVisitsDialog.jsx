import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BRAND } from "@/lib/brand";
import { ADVERTISE_VISITS_EXPERT_BODY, ADVERTISE_VISITS_EXPERT_TITLE } from "@/lib/siteCopy";

export default function ExpertVisitsDialog({ children }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold pr-6">
            {ADVERTISE_VISITS_EXPERT_TITLE}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {ADVERTISE_VISITS_EXPERT_BODY.replace(/HABIBAR/g, BRAND.name)}
        </p>
      </DialogContent>
    </Dialog>
  );
}
