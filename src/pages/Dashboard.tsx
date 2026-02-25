import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import StatsCard from "@/components/StatsCard";
import {
  BookOpen, Users, Video, Award, DollarSign, UserCheck,
  Moon, Sun, Search, Bell, LogOut, Menu, ChevronLeft, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const chartData = [
  { month: "Ene", matriculas: 45, completados: 30 },
  { month: "Feb", matriculas: 80, completados: 55 },
  { month: "Mar", matriculas: 65, completados: 40 },
  { month: "Abr", matriculas: 50, completados: 35 },
  { month: "May", matriculas: 70, completados: 60 },
  { month: "Jun", matriculas: 55, completados: 38 },
  { month: "Jul", matriculas: 90, completados: 65 },
  { month: "Ago", matriculas: 75, completados: 50 },
  { month: "Sep", matriculas: 60, completados: 45 },
  { month: "Oct", matriculas: 85, completados: 70 },
  { month: "Nov", matriculas: 70, completados: 55 },
  { month: "Dic", matriculas: 95, completados: 72 },
];

const generateCalendar = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  const days: { day: number; current: boolean; today: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevDays - i, current: false, today: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, current: true, today: i === today.getDate() });
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, current: false, today: false });
  }
  return days;
};

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const today = new Date();
  const calendarDays = generateCalendar();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="lg:ml-64">
        {/* Top bar */}
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
              {theme === "light" ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
            </button>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground relative">
              <Bell className="w-4.5 h-4.5" />
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

        {/* Content */}
        <main className="p-4 md:p-6 space-y-6">
          {/* Welcome + Stats */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="glass-card rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-2xl font-display font-bold text-primary">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <p className="text-sm text-primary font-semibold">Disponible hoy</p>
                <p className="text-xs text-muted-foreground">Desde: Instituto D'Campus</p>
                <p className="text-lg font-display font-bold text-foreground mt-1">{user?.name || "Usuario"}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role || "Admin"}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatsCard
              value={40}
              label="Cursos"
              subtitle="Ayer: 32 cursos"
              icon={<BookOpen className="w-5 h-5 text-primary" />}
            />
            <StatsCard
              value={21}
              label="Nuevas Matrículas"
              subtitle="Ayer: 18 matrículas"
              icon={<UserCheck className="w-5 h-5 text-primary" />}
            />
            <StatsCard
              value={14}
              label="Sesiones en Vivo"
              subtitle="Ayer: 9 sesiones"
              icon={<Video className="w-5 h-5 text-primary" />}
            />
            <StatsCard
              value={15}
              label="Profesores"
              subtitle="Disponibles hoy"
              icon={<Users className="w-5 h-5 text-primary" />}
            />
            <StatsCard
              value={36}
              label="Evaluaciones"
              subtitle="Pendientes de calificar"
              icon={<Award className="w-5 h-5 text-primary" />}
            />
            <StatsCard
              value="$52,140"
              label="Ingresos"
              subtitle="Ayer: $41,876"
              icon={<DollarSign className="w-5 h-5 text-primary" />}
            />
          </div>

          {/* Chart + Calendar */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Chart */}
            <div className="lg:col-span-3 glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-display font-semibold text-foreground">Actividad del Campus</h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Matrículas
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent" /> Completados
                  </span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="matriculas" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="completados" fill="hsl(var(--accent))" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Calendar */}
            <div className="lg:col-span-2 glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-display font-semibold text-foreground">Calendario</h3>
                <div className="flex items-center gap-1">
                  <button className="p-1 rounded hover:bg-muted text-muted-foreground"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-sm font-medium text-primary px-2">
                    {MONTHS[today.getMonth()]} {today.getFullYear()}
                  </span>
                  <button className="p-1 rounded hover:bg-muted text-muted-foreground"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map((d) => (
                  <div key={d} className="py-1.5 font-semibold text-muted-foreground">{d}</div>
                ))}
                {calendarDays.map((d, i) => (
                  <div
                    key={i}
                    className={`py-1.5 rounded-md text-xs transition-colors ${
                      d.today
                        ? "bg-primary text-primary-foreground font-bold"
                        : d.current
                          ? "text-foreground hover:bg-muted cursor-pointer"
                          : "text-muted-foreground/40"
                    }`}
                  >
                    {d.day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
