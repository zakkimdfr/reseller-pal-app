import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import DashboardLayout from "./components/dashboard/DashboardLayout";
import ProtectedRoute from "./components/dashboard/ProtectedRoute";
import Overview from "./pages/dashboard/Overview";
import Products from "./pages/dashboard/Products";
import Inventory from "./pages/dashboard/Inventory";
import Sales from "./pages/dashboard/Sales";
import Reports from "./pages/dashboard/Reports";
import SettingsPage from "./pages/dashboard/SettingsPage";

const queryClient = new QueryClient();

const DashboardPage = ({ children, roles }: { children: React.ReactNode; roles?: ("admin" | "owner" | "staff")[] }) => (
  <ProtectedRoute allowedRoles={roles}>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage><Overview /></DashboardPage>} />
          <Route path="/dashboard/products" element={<DashboardPage roles={["admin", "owner"]}><Products /></DashboardPage>} />
          <Route path="/dashboard/inventory" element={<DashboardPage><Inventory /></DashboardPage>} />
          <Route path="/dashboard/sales" element={<DashboardPage><Sales /></DashboardPage>} />
          <Route path="/dashboard/reports" element={<DashboardPage roles={["admin", "owner"]}><Reports /></DashboardPage>} />
          <Route path="/dashboard/settings" element={<DashboardPage roles={["admin"]}><SettingsPage /></DashboardPage>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
