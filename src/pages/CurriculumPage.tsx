import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { mockCurriculums as initialCurriculums, mockCareers, mockSubjects } from "@/data/mockStore";
import { Curriculum, CurriculumEntry } from "@/types/dcampus";
import { FormDialog, DeleteDialog } from "@/components/CrudDialog";
import { Layers, BookOpen, CheckCircle2, Circle, ArrowRight, Plus, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const gid = () => Math.random().toString(36).substr(2, 9);

const CurriculumPage = () => {
  const { user } = useAuth();
  const instId = user?.institutionId;
  const isSuperAdmin = user?.role === "superadmin";

  const [curriculums, setCurriculums] = useState<Curriculum[]>(
    isSuperAdmin ? [...initialCurriculums] : initialCurriculums.filter((c) => c.institutionId === instId)
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Curriculum | null>(null);
  const [deleteItem, setDeleteItem] = useState<Curriculum | null>(null);

  // Entry CRUD
  const [entryFormOpen, setEntryFormOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<{ curriculumId: string; entry?: CurriculumEntry } | null>(null);
  const [deleteEntry, setDeleteEntry] = useState<{ curriculumId: string; entry: CurriculumEntry } | null>(null);

  const curriculumFields = [
    { key: "name", label: "Nombre", placeholder: "Ej: Pensum 2026", required: true },
    { key: "year", label: "Año", type: "number" as const, placeholder: "2026" },
    { key: "careerId", label: "Carrera", type: "select" as const, options: mockCareers.map((c) => ({ value: c.id, label: c.name })) },
    { key: "isActive", label: "Estado", type: "checkbox" as const, placeholder: "Pensum activo" },
  ];

  const entryFields = [
    { key: "subjectId", label: "Materia", type: "select" as const, options: mockSubjects.map((s) => ({ value: s.id, label: `${s.code} - ${s.name}` })) },
    { key: "semester", label: "Semestre", type: "number" as const, placeholder: "1" },
    { key: "isRequired", label: "Obligatoria", type: "checkbox" as const, placeholder: "Materia obligatoria" },
  ];

  const handleSaveCurriculum = (data: Record<string, any>) => {
    if (editItem) {
      setCurriculums((prev) => prev.map((c) => c.id === editItem.id ? { ...c, name: data.name, year: Number(data.year), careerId: data.careerId, isActive: data.isActive } : c));
      toast({ title: "Pensum actualizado", description: `"${data.name}" fue actualizado.` });
    } else {
      const career = mockCareers.find((c) => c.id === data.careerId);
      const newCur: Curriculum = {
        id: gid(), careerId: data.careerId || "", institutionId: career?.institutionId || instId || "",
        name: data.name, year: Number(data.year) || 2026, isActive: data.isActive !== false, entries: [],
      };
      setCurriculums((prev) => [...prev, newCur]);
      toast({ title: "Pensum creado", description: `"${data.name}" fue agregado.` });
    }
    setEditItem(null);
  };

  const handleDeleteCurriculum = () => {
    if (deleteItem) {
      setCurriculums((prev) => prev.filter((c) => c.id !== deleteItem.id));
      toast({ title: "Pensum eliminado", description: `"${deleteItem.name}" fue eliminado.` });
      setDeleteItem(null);
    }
  };

  const handleSaveEntry = (data: Record<string, any>) => {
    if (!editEntry) return;
    const { curriculumId, entry } = editEntry;
    if (entry) {
      setCurriculums((prev) => prev.map((c) => c.id === curriculumId ? {
        ...c, entries: c.entries.map((e) => e.id === entry.id ? { ...e, subjectId: data.subjectId, semester: Number(data.semester), isRequired: data.isRequired } : e),
      } : c));
      toast({ title: "Entrada actualizada" });
    } else {
      const newEntry: CurriculumEntry = { id: gid(), careerId: "", subjectId: data.subjectId, semester: Number(data.semester) || 1, isRequired: data.isRequired !== false, prerequisites: [] };
      setCurriculums((prev) => prev.map((c) => c.id === curriculumId ? { ...c, entries: [...c.entries, newEntry] } : c));
      toast({ title: "Materia agregada al pensum" });
    }
    setEditEntry(null);
  };

  const handleDeleteEntry = () => {
    if (!deleteEntry) return;
    setCurriculums((prev) => prev.map((c) => c.id === deleteEntry.curriculumId ? {
      ...c, entries: c.entries.filter((e) => e.id !== deleteEntry.entry.id),
    } : c));
    toast({ title: "Materia removida del pensum" });
    setDeleteEntry(null);
  };

  return (
    <DashboardLayout title="Pensum / Curriculum">
      <div className="flex justify-end mb-6">
        <button onClick={() => { setEditItem(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Nuevo Pensum
        </button>
      </div>

      <div className="space-y-6">
        {curriculums.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display font-semibold text-foreground mb-2">Sin pensum configurado</h3>
            <p className="text-sm text-muted-foreground">No hay curriculums registrados.</p>
          </div>
        ) : (
          curriculums.map((cur) => {
            const career = mockCareers.find((c) => c.id === cur.careerId);
            const semesters = [...new Set(cur.entries.map((e) => e.semester))].sort((a, b) => a - b);

            return (
              <motion.div key={cur.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl overflow-hidden">
                <div className="p-5 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{career?.name || "Carrera"} — {cur.name}</h3>
                    <p className="text-sm text-muted-foreground">{cur.entries.length} materias · {semesters.length} semestres · {cur.isActive ? "Activo" : "Inactivo"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditEntry({ curriculumId: cur.id })} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20">
                      <Plus className="w-3 h-3" /> Materia
                    </button>
                    <button onClick={() => { setEditItem(cur); setFormOpen(true); }} className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteItem(cur)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cur.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{cur.year}</span>
                  </div>
                </div>

                <div className="p-5">
                  {semesters.map((sem) => {
                    const entries = cur.entries.filter((e) => e.semester === sem);
                    return (
                      <div key={sem} className="mb-4 last:mb-0">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Semestre {sem}</h4>
                        <div className="space-y-1.5">
                          {entries.map((entry) => {
                            const subject = mockSubjects.find((s) => s.id === entry.subjectId);
                            const prereqNames = entry.prerequisites.map((pid) => mockSubjects.find((s) => s.id === pid)?.name).filter(Boolean);
                            return (
                              <div key={entry.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors group">
                                <BookOpen className="w-4 h-4 text-primary shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-foreground">{subject?.name || "Materia desconocida"}</span>
                                    <span className="text-xs text-muted-foreground font-mono">{subject?.code}</span>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span>{subject?.credits} créditos</span>
                                    {entry.isRequired ? (
                                      <span className="flex items-center gap-0.5 text-primary"><CheckCircle2 className="w-3 h-3" /> Obligatoria</span>
                                    ) : (
                                      <span className="flex items-center gap-0.5"><Circle className="w-3 h-3" /> Electiva</span>
                                    )}
                                    {prereqNames.length > 0 && (
                                      <span className="flex items-center gap-0.5"><ArrowRight className="w-3 h-3" /> Prerequisito: {prereqNames.join(", ")}</span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => setEditEntry({ curriculumId: cur.id, entry })} className="p-1 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-3 h-3" /></button>
                                  <button onClick={() => setDeleteEntry({ curriculumId: cur.id, entry })} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  {cur.entries.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">Sin materias en el pensum. Haz clic en "+ Materia" para agregar.</p>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Curriculum CRUD */}
      <FormDialog open={formOpen} onClose={() => { setFormOpen(false); setEditItem(null); }} onSave={handleSaveCurriculum}
        title={editItem ? "Editar Pensum" : "Nuevo Pensum"} fields={curriculumFields} initialData={editItem || undefined} />
      <DeleteDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDeleteCurriculum}
        title="Eliminar pensum" description={`¿Estás seguro de eliminar "${deleteItem?.name}"?`} />

      {/* Entry CRUD */}
      <FormDialog open={!!editEntry} onClose={() => setEditEntry(null)} onSave={handleSaveEntry}
        title={editEntry?.entry ? "Editar Materia en Pensum" : "Agregar Materia al Pensum"} fields={entryFields}
        initialData={editEntry?.entry || undefined} />
      <DeleteDialog open={!!deleteEntry} onClose={() => setDeleteEntry(null)} onConfirm={handleDeleteEntry}
        title="Remover materia" description="¿Estás seguro de remover esta materia del pensum?" />
    </DashboardLayout>
  );
};

export default CurriculumPage;
