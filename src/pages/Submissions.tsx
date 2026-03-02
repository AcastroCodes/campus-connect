import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockSubmissions as initialSubmissions } from "@/data/mockStore";
import { Submission, RESOURCE_PROVIDER_LABELS, ResourceProvider } from "@/types/dcampus";
import { FormDialog, DeleteDialog } from "@/components/CrudDialog";
import { FileText, ExternalLink, CheckCircle2, Clock, Search, MessageSquare, Plus, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const gid = () => Math.random().toString(36).substr(2, 9);

const Submissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([...initialSubmissions]);
  const [search, setSearch] = useState("");
  const [filterGraded, setFilterGraded] = useState<"all" | "graded" | "pending">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Submission | null>(null);
  const [deleteItem, setDeleteItem] = useState<Submission | null>(null);

  const filtered = submissions.filter((s) => {
    const matchSearch = s.studentName.toLowerCase().includes(search.toLowerCase());
    const matchGraded = filterGraded === "all" || (filterGraded === "graded" ? s.grade !== undefined : s.grade === undefined);
    return matchSearch && matchGraded;
  });

  const fields = [
    { key: "studentName", label: "Estudiante", placeholder: "Nombre del estudiante", required: true },
    { key: "linkUrl", label: "URL de entrega", placeholder: "https://drive.google.com/..." },
    { key: "linkProvider", label: "Proveedor", type: "select" as const, options: (["drive", "mega", "mediafire", "youtube", "external"] as ResourceProvider[]).map((p) => ({ value: p, label: RESOURCE_PROVIDER_LABELS[p] })) },
    { key: "comment", label: "Comentario", type: "textarea" as const, placeholder: "Comentario del estudiante..." },
    { key: "grade", label: "Calificación (0-100)", type: "number" as const, placeholder: "85" },
    { key: "feedback", label: "Feedback del profesor", type: "textarea" as const, placeholder: "Retroalimentación..." },
  ];

  const handleSave = (data: Record<string, any>) => {
    if (editItem) {
      setSubmissions((prev) => prev.map((s) => s.id === editItem.id ? {
        ...s, studentName: data.studentName, linkUrl: data.linkUrl, linkProvider: data.linkProvider as ResourceProvider,
        comment: data.comment, grade: data.grade ? Number(data.grade) : undefined,
        feedback: data.feedback || undefined, gradedAt: data.grade ? new Date().toISOString() : undefined,
      } : s));
      toast({ title: "Entrega actualizada", description: `Entrega de "${data.studentName}" fue actualizada.` });
    } else {
      const newSubmission: Submission = {
        id: gid(), evaluationItemId: "", studentId: gid(), studentName: data.studentName,
        courseSectionId: "", linkUrl: data.linkUrl || "", linkProvider: (data.linkProvider as ResourceProvider) || "external",
        comment: data.comment || "", submittedAt: new Date().toISOString(),
        grade: data.grade ? Number(data.grade) : undefined, feedback: data.feedback || undefined,
        gradedAt: data.grade ? new Date().toISOString() : undefined,
      };
      setSubmissions((prev) => [...prev, newSubmission]);
      toast({ title: "Entrega registrada", description: `Entrega de "${data.studentName}" fue agregada.` });
    }
    setEditItem(null);
  };

  const handleDelete = () => {
    if (deleteItem) {
      setSubmissions((prev) => prev.filter((s) => s.id !== deleteItem.id));
      toast({ title: "Entrega eliminada", description: `Entrega de "${deleteItem.studentName}" fue eliminada.` });
      setDeleteItem(null);
    }
  };

  return (
    <DashboardLayout title="Entregas de Estudiantes">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Buscar por estudiante..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "graded"] as const).map((f) => (
            <button key={f} onClick={() => setFilterGraded(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterGraded === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
              {f === "all" ? "Todas" : f === "graded" ? "Calificadas" : "Pendientes"}
            </button>
          ))}
          <button onClick={() => { setEditItem(null); setFormOpen(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
            <Plus className="w-3.5 h-3.5" /> Nueva
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((submission, i) => (
          <motion.div key={submission.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="glass-card rounded-xl p-5 hover:border-primary/20 transition-all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-semibold text-foreground text-sm">{submission.studentName}</h3>
                  {submission.grade !== undefined ? (
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 className="w-3 h-3" /> {submission.grade}/100
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                      <Clock className="w-3 h-3" /> Pendiente
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Entregado: {new Date(submission.submittedAt).toLocaleString("es-ES")} · Vía {RESOURCE_PROVIDER_LABELS[submission.linkProvider]}
                </p>
                {submission.comment && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {submission.comment}</p>}
                {submission.feedback && <p className="text-xs text-primary mt-1">Feedback: {submission.feedback}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => { setEditItem(submission); setFormOpen(true); }} className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => setDeleteItem(submission)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                <a href={submission.linkUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20">
                  <ExternalLink className="w-3.5 h-3.5" /> Ver
                </a>
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="glass-card rounded-xl p-12 text-center text-muted-foreground text-sm">No se encontraron entregas.</div>
        )}
      </div>

      <FormDialog open={formOpen} onClose={() => { setFormOpen(false); setEditItem(null); }} onSave={handleSave}
        title={editItem ? "Editar Entrega / Calificar" : "Nueva Entrega"} fields={fields} initialData={editItem || undefined} />
      <DeleteDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete}
        title="Eliminar entrega" description={`¿Estás seguro de eliminar la entrega de "${deleteItem?.studentName}"?`} />
    </DashboardLayout>
  );
};

export default Submissions;
