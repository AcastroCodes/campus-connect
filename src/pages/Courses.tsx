import DashboardLayout from "@/components/DashboardLayout";
import { BookOpen, Plus, Search, MoreVertical, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const mockCourses = [
  { id: 1, title: "Desarrollo Web Full Stack", teacher: "Prof. Carlos López", students: 45, modules: 12, status: "active", accent: "#2E9B63", progress: 75 },
  { id: 2, title: "Diseño UX/UI Avanzado", teacher: "Dra. Ana Ríos", students: 32, modules: 8, status: "active", accent: "#3B82F6", progress: 60 },
  { id: 3, title: "Machine Learning Básico", teacher: "Dr. Luis Mendez", students: 28, modules: 10, status: "draft", accent: "#F59E0B", progress: 30 },
  { id: 4, title: "Marketing Digital", teacher: "Prof. María Torres", students: 56, modules: 6, status: "active", accent: "#8B5CF6", progress: 90 },
  { id: 5, title: "Administración de Empresas", teacher: "Dr. Roberto Paz", students: 38, modules: 9, status: "active", accent: "#EF4444", progress: 45 },
  { id: 6, title: "Inglés para Negocios", teacher: "Prof. Sarah Johnson", students: 64, modules: 15, status: "active", accent: "#06B6D4", progress: 80 },
];

const Courses = () => {
  const [search, setSearch] = useState("");
  const filtered = mockCourses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Cursos">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Nuevo Curso
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-xl overflow-hidden hover:border-primary/20 transition-all cursor-pointer"
          >
            <div className="h-2" style={{ backgroundColor: course.accent }} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display font-semibold text-foreground text-sm">{course.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{course.teacher}</p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    course.status === "active"
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/10 text-accent-foreground"
                  }`}
                >
                  {course.status === "active" ? "Activo" : "Borrador"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.students}</span>
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.modules} módulos</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">{course.progress}% completado</p>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Courses;
