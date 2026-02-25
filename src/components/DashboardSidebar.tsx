import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  GraduationCap, LayoutDashboard, BookOpen, Users, CalendarDays,
  ClipboardList, FileText, Building2, MessageSquare, Settings,
  ChevronRight, Moon, Sun, Search, Bell, LogOut, Menu, X
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", active: true },
  { icon: BookOpen, label: "Cursos", path: "/dashboard" },
  { icon: Users, label: "Estudiantes", path: "/dashboard" },
  { icon: CalendarDays, label: "Sesiones en Vivo", path: "/dashboard" },
  { icon: ClipboardList, label: "Evaluaciones", path: "/dashboard" },
  { icon: FileText, label: "Reportes", path: "/dashboard" },
  { icon: Building2, label: "Instituciones", path: "/dashboard" },
  { icon: MessageSquare, label: "Comunidad", path: "/dashboard" },
  { icon: Settings, label: "Configuración", path: "/dashboard" },
];

const DashboardSidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
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
        <nav className="px-3 py-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = item.active;
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
                <item.icon className="w-4.5 h-4.5 shrink-0" />
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
