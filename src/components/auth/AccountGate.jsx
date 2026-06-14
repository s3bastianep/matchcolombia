import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Lock } from "lucide-react";

export default function AccountGate({
  title = "Necesitas una cuenta",
  description = "Inicia sesión o regístrate para continuar.",
  returnTo,
  compact = false,
}) {
  const navigate = useNavigate();
  const redirect = returnTo || window.location.pathname + window.location.search;

  const goLogin = () => navigate("/login", { state: { from: redirect } });
  const goRegister = () => navigate("/register", { state: { from: redirect } });

  return (
    <div className={compact ? "rounded-2xl border border-border/50 bg-secondary/20 p-4" : "rounded-2xl detail-card-soft p-5 sm:p-6 text-center"}>
      <div className={`mx-auto rounded-full bg-[hsl(var(--brand-violet)/0.1)] flex items-center justify-center ${compact ? "w-10 h-10 mb-3" : "w-12 h-12 mb-4"}`}>
        <Lock className={compact ? "w-5 h-5 text-brand-violet" : "w-6 h-6 text-brand-violet"} strokeWidth={2} />
      </div>
      <h3 className={`font-bold text-foreground ${compact ? "text-sm" : "text-base"}`}>{title}</h3>
      <p className={`text-foreground/70 leading-relaxed mt-1.5 ${compact ? "text-xs" : "text-sm"}`}>
        {description}
      </p>
      <div className={`flex flex-col sm:flex-row gap-2 ${compact ? "mt-3" : "mt-5"}`}>
        <button
          type="button"
          onClick={goLogin}
          className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-full gradient-cta text-white text-sm font-bold hover:opacity-95 transition-opacity"
        >
          <LogIn className="w-4 h-4" />
          Iniciar sesión
        </button>
        <button
          type="button"
          onClick={goRegister}
          className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-full btn-violet-outline text-sm font-bold transition-smooth"
        >
          <UserPlus className="w-4 h-4" />
          Crear cuenta
        </button>
      </div>
      <p className="text-[11px] text-foreground/50 mt-3">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" state={{ from: redirect }} className="font-semibold text-brand-violet hover:underline">
          Entra aquí
        </Link>
      </p>
    </div>
  );
}
