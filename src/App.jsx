import React from "react";
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { ROLES } from '@/lib/roles';

import AppLayout from './components/layout/AppLayout';
import RequireAuth from './components/RequireAuth';
import RequireRole from './components/RequireRole';

import AdminLayout from './layouts/AdminLayout';
import SeekerLayout from './layouts/SeekerLayout';
import TenantLayout from './layouts/TenantLayout';
import OwnerLayout from './layouts/OwnerLayout';

import Home from './pages/Home';
import Explore from './pages/Explore';
import PropertyDetail from './pages/PropertyDetail';
import PublishProperty from './pages/PublishProperty';
import Sell from './pages/Sell';
import Advertise from './pages/Advertise';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProperties from './pages/admin/AdminProperties';
import AdminPropertyEdit from './pages/admin/AdminPropertyEdit';
import AdminLeads from './pages/admin/AdminLeads';
import AdminVisits from './pages/admin/AdminVisits';
import AdminTenants from './pages/admin/AdminTenants';
import AdminReports from './pages/admin/AdminReports';

import SeekerPortal from './pages/portal/SeekerPortal';
import SeekerApplications from './pages/portal/SeekerApplications';
import SeekerMessages from './pages/portal/SeekerMessages';
import SeekerVisits from './pages/portal/SeekerVisits';

import TenantPortal from './pages/portal/TenantPortal';
import TenantContract from './pages/portal/TenantContract';
import TenantPayments from './pages/portal/TenantPayments';
import TenantTickets from './pages/portal/TenantTickets';

import OwnerPortal from './pages/portal/OwnerPortal';
import OwnerProperties from './pages/portal/OwnerProperties';
import OwnerLeads from './pages/portal/OwnerLeads';
import OwnerTickets from './pages/portal/OwnerTickets';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/olvide-contrasena" element={<ForgotPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explorar" element={<Explore />} />
        <Route path="/anunciar" element={<Advertise />} />
        <Route path="/publicar" element={<Sell />} />
        <Route path="/propiedad/:id" element={<PropertyDetail />} />
        <Route element={<RequireAuth />}>
          <Route path="/publicar/nuevo" element={<PublishProperty />} />
          <Route path="/favoritos" element={<Favorites />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<RequireRole roles={[ROLES.ADMIN]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/propiedades" element={<AdminProperties />} />
          <Route path="/admin/propiedades/:id" element={<AdminPropertyEdit />} />
          <Route path="/admin/leads" element={<AdminLeads />} />
          <Route path="/admin/visitas" element={<AdminVisits />} />
          <Route path="/admin/inquilinos" element={<AdminTenants />} />
          <Route path="/admin/reportes" element={<AdminReports />} />
        </Route>
      </Route>

      {/* Buscador */}
      <Route element={<RequireRole roles={[ROLES.SEEKER, ROLES.ADMIN]} />}>
        <Route element={<SeekerLayout />}>
          <Route path="/portal" element={<SeekerPortal />} />
          <Route path="/portal/aplicaciones" element={<SeekerApplications />} />
          <Route path="/portal/mensajes" element={<SeekerMessages />} />
          <Route path="/portal/visitas" element={<SeekerVisits />} />
        </Route>
      </Route>

      {/* Inquilino */}
      <Route element={<RequireRole roles={[ROLES.TENANT, ROLES.ADMIN]} />}>
        <Route element={<TenantLayout />}>
          <Route path="/inquilino" element={<TenantPortal />} />
          <Route path="/inquilino/contrato" element={<TenantContract />} />
          <Route path="/inquilino/pagos" element={<TenantPayments />} />
          <Route path="/inquilino/tickets" element={<TenantTickets />} />
          <Route path="/inquilino/mensajes" element={<SeekerMessages />} />
        </Route>
      </Route>

      {/* Propietario */}
      <Route element={<RequireRole roles={[ROLES.OWNER, ROLES.ADMIN]} />}>
        <Route element={<OwnerLayout />}>
          <Route path="/propietario" element={<OwnerPortal />} />
          <Route path="/propietario/propiedades" element={<OwnerProperties />} />
          <Route path="/propietario/leads" element={<OwnerLeads />} />
          <Route path="/propietario/tickets" element={<OwnerTickets />} />
        </Route>
      </Route>

      <Route path="/mi-cuenta" element={<Navigate to="/portal" replace />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AppRoutes />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
