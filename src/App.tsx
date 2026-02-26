import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Students from "./pages/Students";
import LiveSessions from "./pages/LiveSessions";
import Assessments from "./pages/Assessments";
import Reports from "./pages/Reports";
import Institutions from "./pages/Institutions";
import Community from "./pages/Community";
import SettingsPage from "./pages/Settings";
import CourseBuilder from "./pages/CourseBuilder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const P = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<P><Dashboard /></P>} />
    <Route path="/courses" element={<P><Courses /></P>} />
    <Route path="/courses/new" element={<P><CourseBuilder /></P>} />
    <Route path="/courses/:id/edit" element={<P><CourseBuilder /></P>} />
    <Route path="/students" element={<P><Students /></P>} />
    <Route path="/live-sessions" element={<P><LiveSessions /></P>} />
    <Route path="/assessments" element={<P><Assessments /></P>} />
    <Route path="/reports" element={<P><Reports /></P>} />
    <Route path="/institutions" element={<P><Institutions /></P>} />
    <Route path="/community" element={<P><Community /></P>} />
    <Route path="/settings" element={<P><SettingsPage /></P>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
