import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import MarketplacePage from "./pages/MarketplacePage";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import FarmerDashboard from "./pages/FarmerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import SpecialistDashboard from "./pages/SpecialistDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DiagnosisResult from "./pages/DiagnosisResult";
import ExpertConnections from "./pages/ExpertConnections";
import NotFound from "./pages/NotFound";
import BottomNavigation from "@/components/BottomNavigation";

const queryClient = new QueryClient();

// Component to handle role-based redirect
const RoleRedirect = () => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">🌱</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect based on user role
  switch (userRole) {
    case 'farmer':
      return <Navigate to="/dashboard-farmer" replace />;
    case 'buyer':
      return <Navigate to="/dashboard-buyer" replace />;
    case 'specialist':
      return <Navigate to="/dashboard-specialist" replace />;
    case 'admin':
      return <Navigate to="/dashboard-admin" replace />;
    default:
      return <Navigate to="/auth" replace />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="relative">
            <Routes>
              <Route path="/" element={<RoleRedirect />} />
              <Route path="/dashboard-farmer" element={<FarmerDashboard />} />
              <Route path="/dashboard-buyer" element={<BuyerDashboard />} />
              <Route path="/dashboard-specialist" element={<SpecialistDashboard />} />
              <Route path="/dashboard-admin" element={<AdminDashboard />} />
              <Route path="/scan" element={<Scan />} />
              <Route path="/diagnosis-result" element={<DiagnosisResult />} />
              <Route path="/expert-connections" element={<ExpertConnections />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth" element={<Auth />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNavigation />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
