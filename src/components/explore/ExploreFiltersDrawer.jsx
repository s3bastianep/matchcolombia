import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { X } from "lucide-react";
import AdvancedFilters from "./AdvancedFilters";
import { viewListingsLabel } from "@/lib/siteCopy";

export default function ExploreFiltersDrawer({
  open,
  onOpenChange,
  filters,
  onChange,
  onClear,
  resultCount,
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92dvh] rounded-t-[1.75rem]">
        <DrawerHeader className="text-left px-5 pt-2 pb-0">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-extrabold">Filtros</DrawerTitle>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="native-icon-btn"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DrawerHeader>
        <div className="overflow-y-auto native-scroll-y px-5 pb-4 flex-1">
          <AdvancedFilters filters={filters} onChange={onChange} onClear={onClear} className="bg-transparent px-0" />
        </div>
        <div className="shrink-0 px-5 pt-3 pb-safe border-t border-border/40 bg-white">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="app-btn-primary w-full py-4 text-sm"
          >
            {viewListingsLabel(resultCount)}
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
