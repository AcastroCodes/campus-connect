import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { mockInstitutions as initialInstitutions, getInstitutionStats } from "@/data/mockStore";
import { Institution, PERIOD_TYPE_LABELS, PeriodType } from "@/types/dcampus";
import { FormDialog, DeleteDialog } from "@/components/CrudDialog";
import { Building2, Plus, Globe, CheckCircle2, XCircle, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const gid = () => Math.random().toString(36).substr(2, 9);

const institutionFields = [
  { key: "name", label: "Nombre", placeholder: "Ej: Universidad del Norte", required: true },
  { key: "subdomain", label: "Subdominio", placeholder: "uninorte" },
  { key: "adminName", label: "Director / Admin", placeholder: "Dr. Juan Pérez" },
  { key: "primaryColor", label: "Color Principal", placeholder: "#2E9B63" },
  { key: "periodType", label: "Tipo de Período", type: "select" as const, options: [
    { value: "trimestre", label: "Trimestre" },
    { value: "bimestre", label: "Bimestre" },
    { value: "semestre", label: "Semestre" },
    { value: "cuatrimestre", label: "Cuatrimestre" },
  ]},
  { key: "isActive", label: "Estado", type: "checkbox" as const, placeholder: "Institución activa" },
];

const Institutions = () => {
  const navigate = useNavigate();
  const [institutions, setInstitutions] = useState<Institution[]>([...initialInstitutions]);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Institution | null>(null);
  const [deleteItem, setDeleteItem] = useState<Institution | null>(null);

  const handleSave = (data: Record<string, any>) => {
    if (editItem) {
      setInstitutions((prev) =>
        prev.map((inst) =>
          inst.id === editItem.id
            ? { ...inst, name: data.name, subdomain: data.subdomain, adminName: data.adminName, primaryColor: data.primaryColor || inst.primaryColor, isActive: data.isActive, config: { ...inst.config, periodType: data.periodType as PeriodType || inst.config.periodType } }
            : inst
        )
      );
      toast({ title: "Institución actualizada", description: `"${data.name}" fue actualizada.` });
    } else {
      const periodType = (data.periodType as PeriodType) || "trimestre";
      const periodsCount = periodType === "semestre" ? 2 : periodType === "trimestre" ? 3 : periodType === "bimestre" ? 5 : 4;
      const newInst: Institution = {
        id: gid(),
        name: data.name,
        subdomain: data.subdomain || data.name.toLowerCase().replace(/\s+/g, ""),
        isActive: data.isActive !== false,
        primaryColor: data.primaryColor || "#6366F1",
        adminId: "",
        adminName: data.adminName || "",
        config: {
          periodType,
          periodsCount,
          periods: Array.from({ length: periodsCount }, (_, i) => ({
            id: gid(),
            name: `${PERIOD_TYPE_LABELS[periodType]} ${i + 1}`,
            order: i + 1,
          })),
        },
        createdAt: new Date().toISOString().split("T")[0],
      };
      setInstitutions((prev) => [...prev, newInst]);
      toast({ title: "Institución creada", description: `"${data.name}" fue agregada.` });
    }
    setEditItem(null);
  };

  const handleDelete = () => {
    if (deleteItem) {
      setInstitutions((prev) => prev.filter((i) => i.id !== deleteItem.id));
      toast({ title: "Institución eliminada", description: `"${deleteItem.name}" fue eliminada.` });
      setDeleteItem(null);
    }
  };

  const openEdit = (inst: Institution, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditItem(inst);
    setFormOpen(true);
  };

  return (
    <DashboardLayout title="Instituciones">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => { setEditItem(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Nueva Institución
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {institutions.map((inst, i) => {
          const stats = getInstitutionStats(inst.id);
          return (
            <motion.div
              key={inst.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/institutions/${inst.id}`)}
              className="glass-card rounded-xl overflow-hidden hover:border-primary/20 transition-all cursor-pointer group"
            >
              <div className="h-2" style={{ backgroundColor: inst.primaryColor }} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${inst.primaryColor}15` }}>
                      <Building2 className="w-5 h-5" style={{ color: inst.primaryColor }} />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground text-sm">{inst.name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Globe className="w-3 h-3" /> {inst.subdomain}.dcampus.com
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={(e) => openEdit(inst, e)} className="p-1.5 rounded hover:bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteItem(inst); }} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Admin: {inst.adminName}</p>
                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div><p className="text-sm font-bold text-foreground">{stats.careersCount}</p><p className="text-xs text-muted-foreground">Carreras</p></div>
                  <div><p className="text-sm font-bold text-foreground">{stats.studentsCount}</p><p className="text-xs text-muted-foreground">Alumnos</p></div>
                  <div><p className="text-sm font-bold text-foreground">{stats.subjectsCount}</p><p className="text-xs text-muted-foreground">Materias</p></div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                  <span>Tasa de entregas: {stats.submissionRate}%</span>
                  <span className="flex items-center gap-1">
                    {inst.isActive ? (
                      <><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Activa</>
                    ) : (
                      <><XCircle className="w-3.5 h-3.5 text-destructive" /> Inactiva</>
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <FormDialog
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditItem(null); }}
        onSave={handleSave}
        title={editItem ? "Editar Institución" : "Nueva Institución"}
        fields={institutionFields}
        initialData={editItem ? { ...editItem, periodType: editItem.config.periodType } : undefined}
      />

      <DeleteDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Eliminar institución"
        description={`¿Estás seguro de eliminar "${deleteItem?.name}"? Esta acción no se puede deshacer.`}
      />
    </DashboardLayout>
  );
};

export default Institutions;
