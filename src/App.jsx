import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { ROLES } from '@/lib/roles';
import { PropertyPanelProvider } from '@/lib/PropertyPanelContext';
import { lazyWithRetry as lazy } from '@/lib/lazyWithRetry';

import AppLayout from './components/layout/AppLayout';
import RequireAuth from './components/RequireAuth';
import RequireRole from './components/RequireRole';

const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const SeekerLayout = lazy(() => import('./layouts/SeekerLayout'));
const TenantLayout = lazy(() => import('./layouts/TenantLayout'));
const OwnerLayout = lazy(() => import('./layouts/OwnerLayout'));
const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const PropertyLanding = lazy(() => import('./pages/PropertyLanding'));
const PublishProperty = lazy(() => import('./pages/PublishProperty'));
const Sell = lazy(() => import('./pages/Sell'));
const Advertise = lazy(() => import('./pages/Advertise'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Faq = lazy(() => import('./pages/Faq'));
const ArriendosBogota = lazy(() => import('./pages/ArriendosBogota'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const AppMobilePreview = lazy(() => import('./pages/AppMobilePreview'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProperties = lazy(() => import('./pages/admin/AdminProperties'));
const AdminPropertyEdit = lazy(() => import('./pages/admin/AdminPropertyEdit'));
const AdminLeads = lazy(() => import('./pages/admin/AdminLeads'));
const AdminVisits = lazy(() => import('./pages/admin/AdminVisits'));
const AdminTenants = lazy(() => import('./pages/admin/AdminTenants'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminApplications = lazy(() => import('./pages/admin/AdminApplications'));
const AdminOwners = lazy(() => import('./pages/admin/AdminOwners'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminNotifications = lazy(() => import('./pages/admin/AdminNotifications'));

const SeekerPortal = lazy(() => import('./pages/portal/SeekerPortal'));
const SeekerApplications = lazy(() => import('./pages/portal/SeekerApplications'));
const SeekerMessages = lazy(() => import('./pages/portal/SeekerMessages'));
const SeekerVisits = lazy(() => import('./pages/portal/SeekerVisits'));

const TenantPortal = lazy(() => import('./pages/portal/TenantPortal'));
const TenantContract = lazy(() => import('./pages/portal/TenantContract'));
const TenantPayments = lazy(() => import('./pages/portal/TenantPayments'));
const TenantTickets = lazy(() => import('./pages/portal/TenantTickets'));

const OwnerPortal = lazy(() => import('./pages/portal/OwnerPortal'));
const OwnerProperties = lazy(() => import('./pages/portal/OwnerProperties'));
const OwnerLeads = lazy(() => import('./pages/portal/OwnerLeads'));
const OwnerTickets = lazy(() => import('./pages/portal/OwnerTickets'));
const OwnerFinance = lazy(() => import('./pages/portal/OwnerFinance'));

const RouteSeo = lazy(() => import('@/components/seo/RouteSeo'));

function PageLoader() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-brand-violet border-t-transparent animate-spin" />
    </div>
  );
}

function RouteFallback() {
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  if (path === "/" || path === "") {
    return <div className="min-h-[55vh] bg-white" aria-hidden="true" />;
  }
  return <PageLoader />;
}

function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/vista-previa-app" element={<AppMobilePreview />} />
        <Route path="/vender" element={<Navigate to="/publicar" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/olvide-contrasena" element={<ForgotPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/arriendos-bogota" element={<ArriendosBogota />} />
          <Route path="/explorar" element={<Explore />} />
          <Route path="/explorar/compra" element={<Explore />} />
          <Route path="/explorar/apartamentos" element={<Explore />} />
          <Route path="/explorar/casas" element={<Explore />} />
          <Route path="/explorar/estudios" element={<Explore />} />
          <Route path="/explorar/zona/:zoneSlug" element={<Explore />} />
          <Route path="/anunciar" element={<Advertise />} />
          <Route path="/publicar" element={<Sell />} />
          <Route path="/privacidad" element={<Privacy />} />
          <Route path="/preguntas-frecuentes" element={<Faq />} />
          <Route path="/propiedad/:id" element={<PropertyLanding />} />
          <Route element={<RequireAuth />}>
            <Route path="/publicar/nuevo" element={<PublishProperty />} />
            <Route path="/favoritos" element={<Favorites />} />
          </Route>
        </Route>

        <Route element={<RequireRole roles={[ROLES.ADMIN]} />}>
          <Route element={<Suspense fallback={<PageLoader />}><AdminLayout /></Suspense>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/propiedades" element={<AdminProperties />} />
            <Route path="/admin/propiedades/:id" element={<AdminPropertyEdit />} />
            <Route path="/admin/leads" element={<AdminLeads />} />
            <Route path="/admin/visitas" element={<AdminVisits />} />
            <Route path="/admin/inquilinos" element={<AdminTenants />} />
            <Route path="/admin/aplicaciones" element={<AdminApplications />} />
            <Route path="/admin/propietarios" element={<AdminOwners />} />
            <Route path="/admin/configuracion" element={<AdminSettings />} />
            <Route path="/admin/notificaciones" element={<AdminNotifications />} />
            <Route path="/admin/reportes" element={<AdminReports />} />
          </Route>
        </Route>

        <Route element={<RequireRole roles={[ROLES.SEEKER, ROLES.ADMIN]} />}>
          <Route element={<Suspense fallback={<PageLoader />}><SeekerLayout /></Suspense>}>
            <Route path="/portal" element={<SeekerPortal />} />
            <Route path="/portal/aplicaciones" element={<SeekerApplications />} />
            <Route path="/portal/mensajes" element={<SeekerMessages />} />
            <Route path="/portal/visitas" element={<SeekerVisits />} />
          </Route>
        </Route>

        <Route element={<RequireRole roles={[ROLES.TENANT, ROLES.ADMIN]} />}>
          <Route element={<Suspense fallback={<PageLoader />}><TenantLayout /></Suspense>}>
            <Route path="/inquilino" element={<TenantPortal />} />
            <Route path="/inquilino/contrato" element={<TenantContract />} />
            <Route path="/inquilino/pagos" element={<TenantPayments />} />
            <Route path="/inquilino/tickets" element={<TenantTickets />} />
            <Route path="/inquilino/mensajes" element={<SeekerMessages />} />
          </Route>
        </Route>

        <Route element={<RequireRole roles={[ROLES.OWNER, ROLES.ADMIN]} />}>
          <Route element={<Suspense fallback={<PageLoader />}><OwnerLayout /></Suspense>}>
            <Route path="/propietario" element={<OwnerPortal />} />
            <Route path="/propietario/propiedades" element={<OwnerProperties />} />
            <Route path="/propietario/leads" element={<OwnerLeads />} />
            <Route path="/propietario/tickets" element={<OwnerTickets />} />
            <Route path="/propietario/rentabilidad" element={<OwnerFinance />} />
          </Route>
        </Route>

        <Route path="/mi-cuenta" element={<Navigate to="/portal" replace />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <PropertyPanelProvider>
            <Suspense fallback={null}>
              <RouteSeo />
            </Suspense>
            <AppRoutes />
          </PropertyPanelProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
