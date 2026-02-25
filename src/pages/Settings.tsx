import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Moon, Sun, User, Bell, Shield, Palette } from "lucide-react";

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <DashboardLayout title="Configuración">
      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold text-foreground">Perfil</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nombre</label>
              <input type="text" defaultValue={user?.name || ""} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input type="email" defaultValue={user?.email || ""} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Guardar Cambios
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold text-foreground">Apariencia</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Modo Oscuro</p>
              <p className="text-xs text-muted-foreground">Cambia entre tema claro y oscuro</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-colors ${theme === "dark" ? "bg-primary" : "bg-muted"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow-sm transition-transform flex items-center justify-center ${theme === "dark" ? "translate-x-6" : "translate-x-0.5"}`}>
                {theme === "dark" ? <Moon className="w-3 h-3 text-primary" /> : <Sun className="w-3 h-3 text-muted-foreground" />}
              </div>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold text-foreground">Notificaciones</h3>
          </div>
          <div className="space-y-3">
            {["Nuevas matrículas", "Entregas de evaluaciones", "Mensajes de comunidad", "Sesiones en vivo"].map((item) => (
              <div key={item} className="flex items-center justify-between py-1">
                <span className="text-sm text-foreground">{item}</span>
                <button className="relative w-10 h-5 rounded-full bg-primary transition-colors">
                  <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-card shadow-sm" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
