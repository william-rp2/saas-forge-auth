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
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AccessManagement from "./pages/admin/AccessManagement";
import PlansPage from "./pages/admin/Plans";
import PlanEditPage from "./pages/admin/PlanEdit";
import SettingsLayout from "./pages/settings/SettingsLayout";
import Profile from "./pages/settings/Profile";
import Security from "./pages/settings/Security";
import Preferences from "./pages/settings/Preferences";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import CreateTeamPage from "./pages/teams/CreateTeam";
import TeamLayout from "./pages/settings/team/TeamLayout";
import Members from "./pages/settings/team/Members";
import Invitations from "./pages/settings/team/Invitations";

import { ThemeProvider } from '@/components/providers/theme-provider';
import { TeamProvider } from '@/lib/contexts/TeamContext';
import { initializeMocks } from "@/mocks";

const queryClient = new QueryClient();

// Initialize mock system
initializeMocks();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TeamProvider>
          <ThemeProvider defaultTheme="system">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                
                {/* Authentication Routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/signup" element={<Signup />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                
                {/* Teams Routes */}
                <Route path="/teams/create" element={<CreateTeamPage />} />
                
                {/* Application Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="access-management" element={<AccessManagement />} />
                  <Route path="plans" element={<PlansPage />} />
                  <Route path="plans/edit/:id" element={<PlanEditPage />} />
                </Route>
                
                {/* Settings Routes */}
                <Route path="/settings" element={<SettingsLayout />}>
                  <Route path="profile" element={<Profile />} />
                  <Route path="security" element={<Security />} />
                  <Route path="preferences" element={<Preferences />} />
                  <Route path="team" element={<TeamLayout />}>
                    <Route path="members" element={<Members />} />
                    <Route path="invitations" element={<Invitations />} />
                  </Route>
                </Route>
                
                {/* Legal Pages */}
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                
                {/* Catch-all route must be last */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </TeamProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
