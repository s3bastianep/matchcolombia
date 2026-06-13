import React from "react";
import { cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

export default function PipelineBoard({ stages, items, onMove, renderCard }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {stages.map((stage) => {
        const stageItems = items.filter((item) => (item.pipeline_stage || item.status) === stage.key);
        return (
          <div key={stage.key} className="bg-[hsl(0,0%,96%)] rounded-2xl border border-border/30 min-h-[280px] flex flex-col">
            <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
              <p className="text-xs font-extrabold">{stage.label}</p>
              <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full border">{stageItems.length}</span>
            </div>
            <div className="p-3 space-y-2 flex-1 overflow-y-auto max-h-[480px]">
              {stageItems.length === 0 ? (
                <p className="text-[11px] text-muted-foreground text-center py-8">Sin leads</p>
              ) : (
                stageItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl border border-border/40 p-3 shadow-sm">
                    {renderCard(item)}
                    {onMove && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {stages
                          .filter((s) => s.key !== (item.pipeline_stage || item.status))
                          .map((s) => (
                            <button
                              key={s.key}
                              type="button"
                              onClick={() => onMove(item.id, s.key)}
                              className="text-[9px] font-bold px-2 py-1 rounded-md bg-secondary hover:bg-secondary/80"
                            >
                              → {s.label}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-16 px-6 bg-white rounded-2xl border border-border/40">
      <p className="font-extrabold text-lg">{title}</p>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
