import React from "react";
import { Link } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  LayoutDashboard,
  Heart,
  Building2,
  LogIn,
  UserPlus,
  LogOut,
  Sparkles,
  KeyRound,
  Home,
  MessageCircle,
  Signpost,
  Wrench,
  CreditCard,
  Users,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { getUserRole, PANEL_HOME, ROLE_LABELS, ROLES } from "@/lib/roles";
import { BRAND } from "@/lib/brand";

const quickLinks = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/explorar", label: "Buscar arriendos", icon: KeyRound },
  { to: "/explorar/compra", label: "Buscar compra", icon: Home },
  { to: "/anunciar", label: "Anunciar inmueble", icon: Building2 },
  { to: "/publicar", label: "Vender inmueble", icon: Signpost },
];

export default function MobileAccountSheet({ open, onOpenChange, onMatchClick }) {
  const { user, isAuthenticated, logout, isLoadingAuth } = useAuth();

  const close = () => onOpenChange(false);
  const role = user ? getUserRole(user) : null;

  const panelLinks =
    role === ROLES.OWNER
      ? [
          { to: "/propietario/propiedades", label: "Mis propiedades", icon: Building2 },
          { to: "/propietario/mensajes", label: "Chat con el equipo", icon: MessageCircle },
          { to: "/propietario/leads", label: "Leads", icon: Users },
        ]
      : role === ROLES.TENANT
        ? [
            { to: "/inquilino/mensajes", label: "Chat con el equipo", icon: MessageCircle },
            { to: "/inquilino/tickets", label: "Mantenimiento", icon: Wrench },
            { to: "/inquilino/pagos", label: "Pagos", icon: CreditCard },
          ]
        : role === ROLES.SEEKER
          ? [{ to: "/portal/mensajes", label: "Chat con el equipo", icon: MessageCircle }]
          : [];

  const handleLogout = async () => {
    close();
    await logout();
  };

  const handleMatch = () => {
    close();
    onMatchClick?.();
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[88vh] rounded-t-[1.75rem]">
        <DrawerHeader className="text-left pb-2">
          <DrawerTitle className="text-xl font-extrabold">
            {isAuthenticated && user ? `Hola, ${user.name?.split(" ")[0] || user.username}` : "Tu cuenta"}
          </DrawerTitle>
          <DrawerDescription>
            {isAuthenticated && user
              ? `${ROLE_LABELS[getUserRole(user)]} · @${user.username}`
              : "Inicia sesión o explora la plataforma"}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-4 overflow-y-auto">
          {!isLoadingAuth && isAuthenticated && user ? (
            <div className="space-y-1">
              <Link
                to={PANEL_HOME[getUserRole(user)] || "/portal"}
                onClick={close}
                className="flex items-center gap-3 rounded-2xl px-4 py-3.5 font-semibold hover:bg-secondary transition-colors"
              >
                <LayoutDashboard className="w-5 h-5 text-brand-violet" />
                Mi panel
              </Link>
              {panelLinks.length > 0 && (
                <div className="rounded-2xl border border-border/50 bg-secondary/30 p-1.5 space-y-0.5">
                  <p className="px-3 pt-1.5 pb-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Tu cuenta
                  </p>
                  {panelLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={close}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-semibold text-sm hover:bg-white transition-colors"
                      >
                        <Icon className="w-4 h-4 text-brand-violet" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
              <Link
                to="/favoritos"
                onClick={close}
                className="flex items-center gap-3 rounded-2xl px-4 py-3.5 font-semibold hover:bg-secondary transition-colors"
              >
                <Heart className="w-5 h-5 text-brand-magenta" />
                Mis guardados
              </Link>
              <button
                type="button"
                onClick={handleMatch}
                className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 font-semibold hover:bg-secondary transition-colors text-left"
              >
                <Sparkles className="w-5 h-5 text-brand-violet" />
                Match inteligente
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 font-semibold text-destructive hover:bg-destructive/5 transition-colors text-left"
              >
                <LogOut className="w-5 h-5" />
                Cerrar sesión
              </button>
            </div>
          ) : !isLoadingAuth ? (
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/login"
                onClick={close}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-border py-3.5 font-bold text-sm"
              >
                <LogIn className="w-4 h-4" />
                Entrar
              </Link>
              <Link
                to="/register"
                onClick={close}
                className="flex items-center justify-center gap-2 rounded-2xl gradient-cta text-white py-3.5 font-bold text-sm shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                Registro
              </Link>
            </div>
          ) : null}

          <div className="rounded-2xl border border-border/60 bg-secondary/40 p-2">
            <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Explorar
            </p>
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to + link.label}
                  to={link.to}
                  onClick={close}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 font-medium text-sm hover:bg-white transition-colors"
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <a
            href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`Hola, tengo una consulta sobre ${BRAND.name}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="flex items-center justify-center gap-2 w-full rounded-2xl bg-[#25D366]/10 border border-[#25D366]/25 text-[#128C7E] font-bold py-3.5 text-sm"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp · ¿Dudas?
          </a>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
