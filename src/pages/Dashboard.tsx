import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import {
  BookOpen, Users, Video, Award, DollarSign, UserCheck,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
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
  for (let i = firstDay - 1; i >= 0; i--) days.push({ day: prevDays - i, current: false, today: false });
  for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, current: true, today: i === today.getDate() });
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) days.push({ day: i, current: false, today: false });
  return days;
};

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const Dashboard = () => {
  const { user } = useAuth();
  const today = new Date();
  const calendarDays = generateCalendar();

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="glass-card rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-2xl font-display font-bold text-primary">{user?.name?.charAt(0) || "U"}</span>
            </div>
            <div>
              <p className="text-sm text-primary font-semibold">Disponible hoy</p>
              <p className="text-xs text-muted-foreground">Desde: Instituto D'Campus</p>
              <p className="text-lg font-display font-bold text-foreground mt-1">{user?.name || "Usuario"}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role || "Admin"}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard value={40} label="Cursos" subtitle="Ayer: 32 cursos" icon={<BookOpen className="w-5 h-5 text-primary" />} />
          <StatsCard value={21} label="Nuevas Matrículas" subtitle="Ayer: 18 matrículas" icon={<UserCheck className="w-5 h-5 text-primary" />} />
          <StatsCard value={14} label="Sesiones en Vivo" subtitle="Ayer: 9 sesiones" icon={<Video className="w-5 h-5 text-primary" />} />
          <StatsCard value={15} label="Profesores" subtitle="Disponibles hoy" icon={<Users className="w-5 h-5 text-primary" />} />
          <StatsCard value={36} label="Evaluaciones" subtitle="Pendientes de calificar" icon={<Award className="w-5 h-5 text-primary" />} />
          <StatsCard value="$52,140" label="Ingresos" subtitle="Ayer: $41,876" icon={<DollarSign className="w-5 h-5 text-primary" />} />
        </div>

        {/* Chart + Calendar */}
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-display font-semibold text-foreground">Actividad del Campus</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> Matrículas</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-accent" /> Completados</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="matriculas" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="completados" fill="hsl(var(--accent))" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-2 glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-display font-semibold text-foreground">Calendario</h3>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded hover:bg-muted text-muted-foreground"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-sm font-medium text-primary px-2">{MONTHS[today.getMonth()]} {today.getFullYear()}</span>
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
                    d.today ? "bg-primary text-primary-foreground font-bold" : d.current ? "text-foreground hover:bg-muted cursor-pointer" : "text-muted-foreground/40"
                  }`}
                >
                  {d.day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
