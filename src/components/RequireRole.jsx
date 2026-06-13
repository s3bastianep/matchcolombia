import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { canAccessPanel } from "@/lib/roles";

export default function RequireRole({ roles, redirectTo = "/login" }) {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Cargando…
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;
  if (!canAccessPanel(user, roles)) return <Navigate to="/" replace />;

  return <Outlet />;
}
