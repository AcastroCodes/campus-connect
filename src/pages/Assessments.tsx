import DashboardLayout from "@/components/DashboardLayout";
import { ClipboardList, Plus, Calendar, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

const mockAssignments = [
  { id: 1, title: "Proyecto Final: API REST", course: "Desarrollo Web Full Stack", dueDate: "28 Feb 2026", submissions: 38, total: 45, graded: 20, status: "active" },
  { id: 2, title: "Wireframes App Móvil", course: "Diseño UX/UI Avanzado", dueDate: "1 Mar 2026", submissions: 25, total: 32, graded: 25, status: "active" },
  { id: 3, title: "Modelo de Regresión", course: "Machine Learning Básico", dueDate: "25 Feb 2026", submissions: 28, total: 28, graded: 28, status: "completed" },
  { id: 4, title: "Plan de Marketing Digital", course: "Marketing Digital", dueDate: "5 Mar 2026", submissions: 10, total: 56, graded: 0, status: "active" },
  { id: 5, title: "Análisis FODA", course: "Administración de Empresas", dueDate: "20 Feb 2026", submissions: 35, total: 38, graded: 35, status: "overdue" },
];

const getStatusInfo = (status: string) => {
  switch (status) {
    case "completed": return { label: "Completada", icon: CheckCircle2, className: "bg-primary/10 text-primary" };
    case "overdue": return { label: "Vencida", icon: AlertCircle, className: "bg-destructive/10 text-destructive" };
    default: return { label: "Activa", icon: Clock, className: "bg-accent/10 text-accent-foreground" };
  }
};

const Assessments = () => {
  return (
    <DashboardLayout title="Evaluaciones">
      <div className="flex justify-end mb-6">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Nueva Evaluación
        </button>
      </div>

      <div className="space-y-4">
        {mockAssignments.map((assignment, i) => {
          const statusInfo = getStatusInfo(assignment.status);
          const StatusIcon = statusInfo.icon;
          return (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl p-5 hover:border-primary/20 transition-all cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-sm">{assignment.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{assignment.course}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {assignment.dueDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{assignment.submissions}/{assignment.total}</p>
                    <p className="text-xs text-muted-foreground">Entregas</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{assignment.graded}</p>
                    <p className="text-xs text-muted-foreground">Calificadas</p>
                  </div>
                  <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${statusInfo.className}`}>
                    <StatusIcon className="w-3.5 h-3.5" /> {statusInfo.label}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default Assessments;
