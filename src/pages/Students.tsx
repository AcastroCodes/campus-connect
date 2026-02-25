import DashboardLayout from "@/components/DashboardLayout";
import { Search, Plus, Mail, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const mockStudents = [
  { id: 1, name: "Ana Martínez", email: "ana@correo.com", courses: 3, progress: 78, status: "active", enrolled: "2025-01-15" },
  { id: 2, name: "Diego Salazar", email: "diego@correo.com", courses: 2, progress: 45, status: "active", enrolled: "2025-02-01" },
  { id: 3, name: "Laura Vega", email: "laura@correo.com", courses: 4, progress: 92, status: "active", enrolled: "2024-11-20" },
  { id: 4, name: "Miguel Ángel Torres", email: "miguel@correo.com", courses: 1, progress: 15, status: "inactive", enrolled: "2025-01-28" },
  { id: 5, name: "Sofía Hernández", email: "sofia@correo.com", courses: 5, progress: 88, status: "active", enrolled: "2024-10-10" },
  { id: 6, name: "Carlos Ruiz", email: "carlos@correo.com", courses: 2, progress: 60, status: "active", enrolled: "2025-03-05" },
  { id: 7, name: "Valentina López", email: "vale@correo.com", courses: 3, progress: 71, status: "active", enrolled: "2024-12-01" },
  { id: 8, name: "Andrés Moreno", email: "andres@correo.com", courses: 1, progress: 33, status: "inactive", enrolled: "2025-02-18" },
];

const Students = () => {
  const [search, setSearch] = useState("");
  const filtered = mockStudents.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Estudiantes">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar estudiantes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Matricular Estudiante
        </button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-semibold text-foreground">Estudiante</th>
                <th className="text-left p-4 font-semibold text-foreground hidden sm:table-cell">Email</th>
                <th className="text-center p-4 font-semibold text-foreground">Cursos</th>
                <th className="text-center p-4 font-semibold text-foreground">Progreso</th>
                <th className="text-center p-4 font-semibold text-foreground">Estado</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, i) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-medium text-foreground">{student.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground hidden sm:table-cell">{student.email}</td>
                  <td className="p-4 text-center text-foreground">{student.courses}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-16 h-1.5 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${student.progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      student.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {student.status === "active" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="p-1.5 rounded hover:bg-muted text-muted-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Students;
