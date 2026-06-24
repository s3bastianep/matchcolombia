import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/railwayClient";
import { StatCard } from "@/components/panels/StatusBadge";
import { MousePointerClick, Eye, Users, Activity, Smartphone, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const PERIODS = [
  { days: 7, label: "7 días" },
  { days: 14, label: "14 días" },
  { days: 30, label: "30 días" },
];

function BarRow({ label, sublabel, count, max }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <li className="space-y-1">
      <div className="flex items-start justify-between gap-3 text-sm">
        <div className="min-w-0">
          <p className="font-semibold text-foreground truncate">{label}</p>
          {sublabel && <p className="text-[11px] text-muted-foreground truncate">{sublabel}</p>}
        </div>
        <span className="text-xs font-bold text-brand-violet tabular-nums shrink-0">{count}</span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className="h-full rounded-full bg-brand-violet/80 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </li>
  );
}

export default function AdminUsage() {
  const [days, setDays] = useState(7);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-usage", days],
    queryFn: () => apiRequest(`/analytics/report?days=${days}`),
    staleTime: 60_000,
  });

  const maxPage = useMemo(
    () => Math.max(0, ...(data?.topPages?.map((p) => p.count) || [])),
    [data?.topPages]
  );
  const maxClick = useMemo(
    () => Math.max(0, ...(data?.topClicks?.map((c) => c.count) || [])),
    [data?.topClicks]
  );

  const mobilePct = useMemo(() => {
    const devices = data?.devices || [];
    const total = devices.reduce((sum, d) => sum + d.count, 0);
    const mobile = devices.find((d) => d.device === "mobile")?.count || 0;
    return total ? Math.round((mobile / total) * 100) : 0;
  }, [data?.devices]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold">Uso del sitio</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Páginas visitadas y clics en la web pública (no incluye el panel admin).
          </p>
        </div>
        <div className="flex items-center gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              type="button"
              onClick={() => setDays(p.days)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors",
                days === p.days
                  ? "bg-brand-violet text-white border-brand-violet"
                  : "bg-white border-border text-muted-foreground hover:border-brand-violet/30"
              )}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-border bg-white text-muted-foreground hover:text-foreground"
          >
            {isFetching ? "…" : "Actualizar"}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="py-16 flex justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-brand-violet border-t-transparent animate-spin" />
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          No se pudo cargar el informe. Verifica que el backend Railway esté activo.
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard label="Sesiones" value={data.summary.sessions} icon={Users} />
            <StatCard label="Vistas de página" value={data.summary.pageViews} icon={Eye} />
            <StatCard label="Clics" value={data.summary.clicks} icon={MousePointerClick} />
            <StatCard
              label="Eventos totales"
              value={data.summary.totalEvents}
              hint={`${mobilePct}% móvil`}
              icon={Activity}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <section className="bg-white rounded-2xl border border-border/40 p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4 text-brand-violet" />
                Páginas más visitadas
              </h3>
              {data.topPages?.length ? (
                <ul className="space-y-4">
                  {data.topPages.map((row) => (
                    <BarRow key={row.path} label={row.path} count={row.count} max={maxPage} />
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Aún no hay visitas registradas en este periodo.</p>
              )}
            </section>

            <section className="bg-white rounded-2xl border border-border/40 p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <MousePointerClick className="w-4 h-4 text-brand-magenta" />
                Dónde hacen clic
              </h3>
              {data.topClicks?.length ? (
                <ul className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                  {data.topClicks.map((row, i) => (
                    <BarRow
                      key={`${row.label}-${row.path}-${i}`}
                      label={row.label}
                      sublabel={[row.path, row.target].filter(Boolean).join(" · ")}
                      count={row.count}
                      max={maxClick}
                    />
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Aún no hay clics registrados en este periodo.</p>
              )}
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <section className="bg-white rounded-2xl border border-border/40 p-6 lg:col-span-2">
              <h3 className="font-bold mb-4">Actividad por día</h3>
              {data.daily?.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground border-b border-border/50">
                        <th className="py-2 font-semibold">Día</th>
                        <th className="py-2 font-semibold">Sesiones</th>
                        <th className="py-2 font-semibold">Eventos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.daily.map((row) => (
                        <tr key={row.day} className="border-b border-border/30 last:border-0">
                          <td className="py-2.5 font-medium">{row.day}</td>
                          <td className="py-2.5 tabular-nums">{row.sessions}</td>
                          <td className="py-2.5 tabular-nums">{row.events}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sin actividad diaria en el periodo.</p>
              )}
            </section>

            <section className="bg-white rounded-2xl border border-border/40 p-6 space-y-5">
              <div>
                <h3 className="font-bold mb-3">Dispositivo</h3>
                <ul className="space-y-2 text-sm">
                  {(data.devices || []).map((d) => (
                    <li key={d.device} className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-muted-foreground capitalize">
                        {d.device === "mobile" ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                        {d.device === "mobile" ? "Móvil" : d.device === "desktop" ? "Escritorio" : d.device}
                      </span>
                      <span className="font-bold tabular-nums">{d.count}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {data.customEvents?.length > 0 && (
                <div>
                  <h3 className="font-bold mb-3">Eventos especiales</h3>
                  <ul className="space-y-2 text-sm">
                    {data.customEvents.map((evt) => (
                      <li key={evt.eventType} className="flex justify-between gap-2">
                        <span className="text-muted-foreground truncate">{evt.eventType}</span>
                        <span className="font-bold tabular-nums">{evt.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Los datos se guardan en tu servidor HABIBAR. Se registran rutas, textos de botones y enlaces clicados.
              </p>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
