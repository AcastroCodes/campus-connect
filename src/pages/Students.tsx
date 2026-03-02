import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockUsers as initialUsers } from "@/data/mockStore";
import { UserProfile, ROLE_LABELS } from "@/types/dcampus";
import { FormDialog, DeleteDialog } from "@/components/CrudDialog";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const gid = () => Math.random().toString(36).substr(2, 9);

const Students = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<UserProfile[]>(
    initialUsers.filter((u) => u.role === "student" && (user?.role === "superadmin" || u.institutionId === user?.institutionId))
  );
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<UserProfile | null>(null);
  const [deleteItem, setDeleteItem] = useState<UserProfile | null>(null);

  const filtered = students.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));

  const fields = [
    { key: "name", label: "Nombre completo", placeholder: "Ana Martínez", required: true },
    { key: "email", label: "Email", type: "email" as const, placeholder: "ana@correo.com" },
    { key: "isActive", label: "Estado", type: "checkbox" as const, placeholder: "Estudiante activo" },
  ];

  const handleSave = (data: Record<string, any>) => {
    if (editItem) {
      setStudents((prev) => prev.map((s) => s.id === editItem.id ? { ...s, name: data.name, email: data.email, isActive: data.isActive } : s));
      toast({ title: "Estudiante actualizado", description: `"${data.name}" fue actualizado.` });
    } else {
      const newStudent: UserProfile = { id: gid(), name: data.name, email: data.email || "", institutionId: user?.institutionId || "inst1", role: "student", isActive: data.isActive !== false };
      setStudents((prev) => [...prev, newStudent]);
      toast({ title: "Estudiante matriculado", description: `"${data.name}" fue agregado.` });
    }
    setEditItem(null);
  };

  const handleDelete = () => {
    if (deleteItem) {
      setStudents((prev) => prev.filter((s) => s.id !== deleteItem.id));
      toast({ title: "Estudiante eliminado", description: `"${deleteItem.name}" fue eliminado.` });
      setDeleteItem(null);
    }
  };

  return (
    <DashboardLayout title="Estudiantes">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Buscar estudiantes..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <button onClick={() => { setEditItem(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
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
                <th className="text-center p-4 font-semibold text-foreground">Estado</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, i) => (
                <motion.tr key={student.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-medium text-foreground">{student.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground hidden sm:table-cell">{student.email}</td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${student.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {student.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex gap-1 justify-center">
                      <button onClick={() => { setEditItem(student); setFormOpen(true); }} className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteItem(student)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground text-sm">No se encontraron estudiantes.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FormDialog open={formOpen} onClose={() => { setFormOpen(false); setEditItem(null); }} onSave={handleSave}
        title={editItem ? "Editar Estudiante" : "Matricular Estudiante"} fields={fields} initialData={editItem || undefined} />
      <DeleteDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete}
        title="Eliminar estudiante" description={`¿Estás seguro de eliminar "${deleteItem?.name}"?`} />
    </DashboardLayout>
  );
};

export default Students;
