import DashboardLayout from "@/components/DashboardLayout";
import { BookOpen, Plus, Search, Users, Trash2, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockCourses } from "@/data/mockCourseStore";
import { toast } from "@/hooks/use-toast";

const Courses = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const filtered = mockCourses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string, title: string) => {
    toast({ title: "Curso eliminado", description: `"${title}" fue eliminado (mock).` });
  };

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
        <button
          onClick={() => navigate("/courses/new")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
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
            className="glass-card rounded-xl overflow-hidden hover:border-primary/20 transition-all"
          >
            <div className="h-2" style={{ backgroundColor: course.accentColor }} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display font-semibold text-foreground text-sm">{course.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{course.teacherName}</p>
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
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.studentsCount}</span>
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.modules.length} módulos</span>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => navigate(`/courses/${course.id}/edit`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Editar
                </button>
                <button
                  onClick={() => handleDelete(course.id, course.title)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Eliminar
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Courses;
