import { ReactNode } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Moon, Sun, Search, Bell, LogOut, Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border h-16 flex items-center px-4 gap-4">
          <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                {user?.name?.charAt(0) || "U"}
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:inline">{user?.name}</span>
              <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground" title="Cerrar sesión">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">
          <h1 className="text-2xl font-display font-bold text-foreground mb-6">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
