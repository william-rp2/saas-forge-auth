import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import AccessManagement from "./pages/admin/AccessManagement";
import SettingsLayout from "./pages/settings/SettingsLayout";
import Profile from "./pages/settings/Profile";
import Security from "./pages/settings/Security";
import Preferences from "./pages/settings/Preferences";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

import { initializeMocks } from "@/mocks";

const queryClient = new QueryClient();

// Initialize mock system
initializeMocks();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Authentication Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            
            {/* Application Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/access-management" element={<AccessManagement />} />
            
            {/* Settings Routes */}
            <Route path="/settings" element={<SettingsLayout />}>
              <Route path="profile" element={<Profile />} />
              <Route path="security" element={<Security />} />
              <Route path="preferences" element={<Preferences />} />
            </Route>
            
            {/* Legal Pages */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* Catch-all route must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
