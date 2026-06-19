import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import BrandLogo from "../brand/BrandLogo";

const TITLES = {
  "/favoritos": "Guardados",
  "/anunciar": "Publicar",
  "/publicar": "Vender",
  "/publicar/nuevo": "Nuevo inmueble",
};

export default function MobileAppHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (pathname === "/explorar") return null;

  const isHome = pathname === "/";
  const title = TITLES[pathname];
  const showBack = !isHome && Boolean(title);

  if (isHome) {
    return (
      <header className="lg:hidden sticky top-0 z-40 native-header">
        <div className="flex items-center justify-center h-12 px-4 pt-safe">
          <BrandLogo size="sm" />
        </div>
      </header>
    );
  }

  return (
    <header className="lg:hidden sticky top-0 z-40 native-header">
      <div className="flex items-center h-12 px-2 gap-1 pt-safe">
        {showBack ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="native-icon-btn"
            aria-label="Volver"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-10" />
        )}
        <h1 className="flex-1 text-center text-base font-extrabold truncate pr-10">{title || "LUMORA HOME"}</h1>
      </div>
    </header>
  );
}
