import React from "react";
import { Link } from "react-router-dom";
import BrandLogo from "./brand/BrandLogo";
export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="color-bar h-[2px] w-full" />
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <BrandLogo size="md" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
            {subtitle && <p className="text-muted-foreground mt-2 text-sm sm:text-base">{subtitle}</p>}
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-black/[0.04] border border-border/50 p-6 sm:p-8">
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
