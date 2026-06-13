import React from "react";
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';

import AppLayout from './components/layout/AppLayout';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home';
import Explore from './pages/Explore';
import PropertyDetail from './pages/PropertyDetail';
import PublishProperty from './pages/PublishProperty';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/olvide-contrasena" element={<ForgotPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/explorar" element={<Explore />} />
              <Route path="/propiedad/:id" element={<PropertyDetail />} />
              <Route element={<RequireAuth />}>
                <Route path="/publicar" element={<PublishProperty />} />
                <Route path="/favoritos" element={<Favorites />} />
              </Route>
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
