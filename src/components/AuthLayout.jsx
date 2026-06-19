import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import BrandLogo from "./brand/BrandLogo";

export default function AuthLayout({ title, subtitle, footer, children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] native-screen flex flex-col">
      <div className="color-bar h-[2px] w-full" />

      <div className="lg:hidden flex items-center h-11 px-2 native-header">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="touch-target flex items-center justify-center w-10 h-10 rounded-full"
          aria-label="Volver"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="flex-1 text-center text-sm font-extrabold pr-10">{title}</span>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-14">
        <div className="w-full max-w-md">
          <div className="hidden lg:flex justify-center mb-8">
            <BrandLogo size="md" />
          </div>

          <div className="lg:hidden flex justify-center mb-6">
            <BrandLogo size="sm" />
          </div>

          <div className="hidden lg:block text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
            {subtitle && <p className="text-muted-foreground mt-2 text-sm sm:text-base">{subtitle}</p>}
          </div>

          {subtitle && (
            <p className="lg:hidden text-center text-sm text-muted-foreground mb-5">{subtitle}</p>
          )}

          <div className="app-card p-6 sm:p-8 lg:shadow-xl lg:shadow-black/[0.04]">
            {children}
          </div>

          {footer && (
            <p className="text-center text-sm text-muted-foreground mt-6">{footer}</p>
          )}
        </div>
      </div>
    </div>
  );
}
