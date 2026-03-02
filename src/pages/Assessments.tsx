import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockCourseSections } from "@/data/mockStore";
import { EvaluationItem, EVALUATION_TYPE_LABELS, EvaluationItemType } from "@/types/dcampus";
import { FormDialog, DeleteDialog } from "@/components/CrudDialog";
import { ClipboardList, Plus, Calendar, CheckCircle2, AlertCircle, Clock, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const gid = () => Math.random().toString(36).substr(2, 9);

interface AssessmentRow extends EvaluationItem {
  courseName: string;
  courseSectionId: string;
  submissions: number;
  total: number;
  graded: number;
  status: "active" | "completed" | "overdue";
}

const buildAssessments = (): AssessmentRow[] => {
  const rows: AssessmentRow[] = [];
  mockCourseSections.forEach((cs) => {
    cs.evaluationPlans.forEach((plan) => {
      plan.items.forEach((item) => {
        const dueDate = item.dueDate ? new Date(item.dueDate) : null;
        const now = new Date();
        const status = !dueDate ? "active" : dueDate < now ? "overdue" : "active";
        rows.push({ ...item, courseName: cs.teacherName + " - " + cs.periodName, courseSectionId: cs.id, submissions: Math.floor(Math.random() * 40) + 5, total: cs.enrollmentsCount, graded: Math.floor(Math.random() * 30), status });
      });
    });
  });
  return rows;
};

const getStatusInfo = (status: string) => {
  switch (status) {
    case "completed": return { label: "Completada", icon: CheckCircle2, className: "bg-primary/10 text-primary" };
    case "overdue": return { label: "Vencida", icon: AlertCircle, className: "bg-destructive/10 text-destructive" };
    default: return { label: "Activa", icon: Clock, className: "bg-accent/10 text-accent-foreground" };
  }
};

const Assessments = () => {
  const [assessments, setAssessments] = useState<AssessmentRow[]>(buildAssessments);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<AssessmentRow | null>(null);
  const [deleteItem, setDeleteItem] = useState<AssessmentRow | null>(null);

  const fields = [
    { key: "title", label: "Título", placeholder: "Ej: Proyecto Final API REST", required: true },
    { key: "type", label: "Tipo", type: "select" as const, options: (["tarea", "examen", "participacion", "proyecto"] as EvaluationItemType[]).map((t) => ({ value: t, label: EVALUATION_TYPE_LABELS[t] })) },
    { key: "description", label: "Descripción", type: "textarea" as const, placeholder: "Descripción de la evaluación..." },
    { key: "weight", label: "Peso (%)", type: "number" as const, placeholder: "25" },
    { key: "dueDate", label: "Fecha límite", placeholder: "2026-03-15" },
    { key: "courseSectionId", label: "Sección", type: "select" as const, options: mockCourseSections.map((cs) => ({ value: cs.id, label: `${cs.teacherName} - ${cs.periodName}` })) },
  ];

  const handleSave = (data: Record<string, any>) => {
    if (editItem) {
      setAssessments((prev) => prev.map((a) => a.id === editItem.id ? { ...a, title: data.title, type: data.type as EvaluationItemType, description: data.description, weight: Number(data.weight), dueDate: data.dueDate } : a));
      toast({ title: "Evaluación actualizada", description: `"${data.title}" fue actualizada.` });
    } else {
      const newAssessment: AssessmentRow = {
        id: gid(), title: data.title, type: (data.type as EvaluationItemType) || "tarea", description: data.description || "",
        weight: Number(data.weight) || 25, dueDate: data.dueDate, courseName: mockCourseSections.find((cs) => cs.id === data.courseSectionId)?.teacherName || "",
        courseSectionId: data.courseSectionId || "", submissions: 0, total: 0, graded: 0, status: "active",
      };
      setAssessments((prev) => [...prev, newAssessment]);
      toast({ title: "Evaluación creada", description: `"${data.title}" fue agregada.` });
    }
    setEditItem(null);
  };

  const handleDelete = () => {
    if (deleteItem) {
      setAssessments((prev) => prev.filter((a) => a.id !== deleteItem.id));
      toast({ title: "Evaluación eliminada", description: `"${deleteItem.title}" fue eliminada.` });
      setDeleteItem(null);
    }
  };

  return (
    <DashboardLayout title="Evaluaciones">
      <div className="flex justify-end mb-6">
        <button onClick={() => { setEditItem(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Nueva Evaluación
        </button>
      </div>

      <div className="space-y-4">
        {assessments.map((assessment, i) => {
          const statusInfo = getStatusInfo(assessment.status);
          const StatusIcon = statusInfo.icon;
          return (
            <motion.div key={assessment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl p-5 hover:border-primary/20 transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-sm">{assessment.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{assessment.courseName} · {EVALUATION_TYPE_LABELS[assessment.type]} · {assessment.weight}%</p>
                    {assessment.dueDate && (
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {assessment.dueDate}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${statusInfo.className}`}>
                    <StatusIcon className="w-3.5 h-3.5" /> {statusInfo.label}
                  </span>
                  <button onClick={() => { setEditItem(assessment); setFormOpen(true); }} className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteItem(assessment)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </motion.div>
          );
        })}
        {assessments.length === 0 && (
          <div className="glass-card rounded-xl p-12 text-center text-muted-foreground text-sm">No hay evaluaciones registradas.</div>
        )}
      </div>

      <FormDialog open={formOpen} onClose={() => { setFormOpen(false); setEditItem(null); }} onSave={handleSave}
        title={editItem ? "Editar Evaluación" : "Nueva Evaluación"} fields={fields} initialData={editItem || undefined} />
      <DeleteDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete}
        title="Eliminar evaluación" description={`¿Estás seguro de eliminar "${deleteItem?.title}"?`} />
    </DashboardLayout>
  );
};

export default Assessments;
