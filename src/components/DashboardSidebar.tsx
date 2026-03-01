import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_LABELS } from "@/types/dcampus";
import {
  GraduationCap, LayoutDashboard, BookOpen, Users, CalendarDays,
  ClipboardList, FileText, Building2, MessageSquare, Settings,
  ChevronRight, X, Upload, BarChart3, Layers
} from "lucide-react";

type NavItem = {
  icon: React.ElementType;
  label: string;
  path: string;
  roles?: string[];
};

const allSidebarItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Building2, label: "Instituciones", path: "/institutions", roles: ["superadmin"] },
  { icon: Layers, label: "Pensum", path: "/curriculum", roles: ["admin", "coordinator"] },
  { icon: BookOpen, label: "Materias / Secciones", path: "/courses", roles: ["admin", "teacher", "coordinator"] },
  { icon: Users, label: "Estudiantes", path: "/students", roles: ["admin", "teacher", "coordinator"] },
  { icon: CalendarDays, label: "Sesiones en Vivo", path: "/live-sessions", roles: ["admin", "teacher", "coordinator", "student"] },
  { icon: ClipboardList, label: "Evaluaciones", path: "/assessments", roles: ["admin", "teacher", "coordinator"] },
  { icon: Upload, label: "Entregas", path: "/submissions", roles: ["teacher", "coordinator", "student"] },
  { icon: BarChart3, label: "Cohorte de Notas", path: "/gradebook", roles: ["admin", "teacher", "coordinator"] },
  { icon: FileText, label: "Reportes", path: "/reports", roles: ["superadmin", "admin", "coordinator"] },
  { icon: MessageSquare, label: "Comunidad", path: "/community" },
  { icon: Settings, label: "Configuración", path: "/settings" },
];

const DashboardSidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const location = useLocation();
  const { user } = useAuth();
  const userRole = user?.role || "student";

  const sidebarItems = allSidebarItems.filter((item) => !item.roles || item.roles.includes(userRole));

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-sidebar z-50 transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 px-5 h-16 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary/20 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-sidebar-foreground" />
          </div>
          <span className="text-lg font-display font-bold text-sidebar-foreground">D'Campus</span>
          <button className="ml-auto lg:hidden text-sidebar-foreground" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-5 py-3 border-b border-sidebar-border">
          <span className="text-xs px-2 py-0.5 rounded-full bg-sidebar-accent text-sidebar-accent-foreground font-medium">
            {ROLE_LABELS[userRole] || userRole}
          </span>
        </div>

        <nav className="px-3 py-4 space-y-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 7rem)" }}>
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                <span className="flex-1">{item.label}</span>
                {!isActive && <ChevronRight className="w-3.5 h-3.5 opacity-40" />}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default DashboardSidebar;
