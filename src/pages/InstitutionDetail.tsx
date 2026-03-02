import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { mockInstitutions, mockCareers as initialCareers, mockSubjects as initialSubjects, mockCourseSections, mockUsers as initialUsers, getInstitutionStats } from "@/data/mockStore";
import { PERIOD_TYPE_LABELS, Career, Subject, UserProfile, ROLE_LABELS, UserRole } from "@/types/dcampus";
import { FormDialog, DeleteDialog } from "@/components/CrudDialog";
import { ArrowLeft, GraduationCap, BookOpen, Users, Briefcase, Calendar, Plus, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const gid = () => Math.random().toString(36).substr(2, 9);

const InstitutionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const institution = mockInstitutions.find((i) => i.id === id);
  const [activeTab, setActiveTab] = useState<"careers" | "subjects" | "periods" | "users">("careers");

  // Local CRUD state
  const [careers, setCareers] = useState<Career[]>(initialCareers.filter((c) => c.institutionId === id));
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects.filter((s) => s.institutionId === id));
  const [users, setUsers] = useState<UserProfile[]>(initialUsers.filter((u) => u.institutionId === id));
  const sections = mockCourseSections.filter((s) => s.institutionId === id);

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<{ id: string; name: string; type: string } | null>(null);

  if (!institution) {
    return (
      <DashboardLayout title="Institución no encontrada">
        <button onClick={() => navigate("/institutions")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
      </DashboardLayout>
    );
  }

  const stats = getInstitutionStats(institution.id);
  const tabs = [
    { key: "careers" as const, label: "Carreras", count: careers.length, icon: GraduationCap },
    { key: "subjects" as const, label: "Materias", count: subjects.length, icon: BookOpen },
    { key: "periods" as const, label: "Períodos", count: institution.config.periodsCount, icon: Calendar },
    { key: "users" as const, label: "Usuarios", count: users.length, icon: Users },
  ];

  // ---- Career CRUD ----
  const careerFields = [
    { key: "name", label: "Nombre", placeholder: "Ej: Ingeniería en Sistemas", required: true },
    { key: "code", label: "Código", placeholder: "ISC" },
    { key: "description", label: "Descripción", type: "textarea" as const, placeholder: "Descripción de la carrera..." },
    { key: "isActive", label: "Estado", type: "checkbox" as const, placeholder: "Carrera activa" },
  ];

  const handleSaveCareer = (data: Record<string, any>) => {
    if (editItem) {
      setCareers((prev) => prev.map((c) => c.id === editItem.id ? { ...c, ...data } : c));
      toast({ title: "Carrera actualizada", description: `"${data.name}" fue actualizada.` });
    } else {
      const newCareer: Career = { id: gid(), institutionId: id!, name: data.name, code: data.code || "", description: data.description || "", isActive: data.isActive !== false, subjectsCount: 0, studentsCount: 0 };
      setCareers((prev) => [...prev, newCareer]);
      toast({ title: "Carrera creada", description: `"${data.name}" fue agregada.` });
    }
  };

  // ---- Subject CRUD ----
  const subjectFields = [
    { key: "name", label: "Nombre", placeholder: "Ej: Desarrollo Web Full Stack", required: true },
    { key: "code", label: "Código", placeholder: "ISC-401" },
    { key: "careerId", label: "Carrera", type: "select" as const, options: careers.map((c) => ({ value: c.id, label: c.name })) },
    { key: "credits", label: "Créditos", type: "number" as const, placeholder: "4" },
    { key: "semester", label: "Semestre", type: "number" as const, placeholder: "1" },
    { key: "isActive", label: "Estado", type: "checkbox" as const, placeholder: "Materia activa" },
  ];

  const handleSaveSubject = (data: Record<string, any>) => {
    if (editItem) {
      setSubjects((prev) => prev.map((s) => s.id === editItem.id ? { ...s, ...data, credits: Number(data.credits), semester: Number(data.semester) } : s));
      toast({ title: "Materia actualizada", description: `"${data.name}" fue actualizada.` });
    } else {
      const newSubject: Subject = { id: gid(), careerId: data.careerId || "", institutionId: id!, name: data.name, code: data.code || "", credits: Number(data.credits) || 3, semester: Number(data.semester) || 1, isActive: data.isActive !== false };
      setSubjects((prev) => [...prev, newSubject]);
      toast({ title: "Materia creada", description: `"${data.name}" fue agregada.` });
    }
  };

  // ---- User CRUD ----
  const userFields = [
    { key: "name", label: "Nombre completo", placeholder: "Juan Pérez", required: true },
    { key: "email", label: "Email", type: "email" as const, placeholder: "juan@correo.com" },
    { key: "role", label: "Rol", type: "select" as const, options: (["admin", "coordinator", "teacher", "student"] as UserRole[]).map((r) => ({ value: r, label: ROLE_LABELS[r] })) },
    { key: "isActive", label: "Estado", type: "checkbox" as const, placeholder: "Usuario activo" },
  ];

  const handleSaveUser = (data: Record<string, any>) => {
    if (editItem) {
      setUsers((prev) => prev.map((u) => u.id === editItem.id ? { ...u, ...data, role: data.role as UserRole } : u));
      toast({ title: "Usuario actualizado", description: `"${data.name}" fue actualizado.` });
    } else {
      const newUser: UserProfile = { id: gid(), name: data.name, email: data.email || "", institutionId: id!, role: (data.role as UserRole) || "student", isActive: data.isActive !== false };
      setUsers((prev) => [...prev, newUser]);
      toast({ title: "Usuario registrado", description: `"${data.name}" fue agregado.` });
    }
  };

  // ---- Generic handlers ----
  const handleOpenCreate = () => { setEditItem(null); setFormOpen(true); };
  const handleOpenEdit = (item: any) => { setEditItem(item); setFormOpen(true); };

  const handleSave = (data: Record<string, any>) => {
    if (activeTab === "careers") handleSaveCareer(data);
    else if (activeTab === "subjects") handleSaveSubject(data);
    else if (activeTab === "users") handleSaveUser(data);
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    if (deleteItem.type === "career") setCareers((prev) => prev.filter((c) => c.id !== deleteItem.id));
    else if (deleteItem.type === "subject") setSubjects((prev) => prev.filter((s) => s.id !== deleteItem.id));
    else if (deleteItem.type === "user") setUsers((prev) => prev.filter((u) => u.id !== deleteItem.id));
    toast({ title: "Eliminado", description: `"${deleteItem.name}" fue eliminado.` });
    setDeleteItem(null);
  };

  const currentFields = activeTab === "careers" ? careerFields : activeTab === "subjects" ? subjectFields : userFields;
  const dialogTitle = editItem
    ? `Editar ${activeTab === "careers" ? "Carrera" : activeTab === "subjects" ? "Materia" : "Usuario"}`
    : `${activeTab === "careers" ? "Nueva Carrera" : activeTab === "subjects" ? "Nueva Materia" : "Nuevo Usuario"}`;

  return (
    <DashboardLayout title={institution.name}>
      <button onClick={() => navigate("/institutions")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Volver a instituciones
      </button>

      {/* Header */}
      <div className="glass-card rounded-xl overflow-hidden mb-6">
        <div className="h-2" style={{ backgroundColor: institution.primaryColor }} />
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${institution.primaryColor}15` }}>
              <Briefcase className="w-7 h-7" style={{ color: institution.primaryColor }} />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-foreground">{institution.name}</h2>
              <p className="text-sm text-muted-foreground">{institution.subdomain}.dcampus.com · Admin: {institution.adminName}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { label: "Carreras", value: careers.length },
              { label: "Materias", value: subjects.length },
              { label: "Secciones", value: stats.sectionsCount },
              { label: "Estudiantes", value: users.filter((u) => u.role === "student").length },
              { label: "Profesores", value: users.filter((u) => u.role === "teacher").length },
              { label: "Tasa entregas", value: `${stats.submissionRate}%` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-display font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className="text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded-full">
              {tab.key === "careers" ? careers.length : tab.key === "subjects" ? subjects.length : tab.key === "users" ? users.length : tab.count}
            </span>
          </button>
        ))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
        {/* Careers */}
        {activeTab === "careers" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                <Plus className="w-4 h-4" /> Nueva Carrera
              </button>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {careers.map((career, i) => (
                <motion.div key={career.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-xl p-5 hover:border-primary/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs font-mono text-muted-foreground">{career.code}</span>
                      <h3 className="font-display font-semibold text-foreground text-sm">{career.name}</h3>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleOpenEdit(career)} className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteItem({ id: career.id, name: career.name, type: "career" })} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{career.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{career.subjectsCount} materias</span>
                    <span>{career.studentsCount} estudiantes</span>
                    <span className={career.isActive ? "text-primary" : "text-destructive"}>{career.isActive ? "Activa" : "Inactiva"}</span>
                  </div>
                </motion.div>
              ))}
              {careers.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground text-sm">No hay carreras registradas.</div>
              )}
            </div>
          </div>
        )}

        {/* Subjects */}
        {activeTab === "subjects" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                <Plus className="w-4 h-4" /> Nueva Materia
              </button>
            </div>
            <div className="glass-card rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-semibold text-foreground">Código</th>
                    <th className="text-left p-4 font-semibold text-foreground">Materia</th>
                    <th className="text-left p-4 font-semibold text-foreground hidden md:table-cell">Carrera</th>
                    <th className="text-center p-4 font-semibold text-foreground">Créditos</th>
                    <th className="text-center p-4 font-semibold text-foreground">Semestre</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject) => {
                    const career = careers.find((c) => c.id === subject.careerId);
                    return (
                      <tr key={subject.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-mono text-xs text-muted-foreground">{subject.code}</td>
                        <td className="p-4 font-medium text-foreground">{subject.name}</td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">{career?.name || "-"}</td>
                        <td className="p-4 text-center text-foreground">{subject.credits}</td>
                        <td className="p-4 text-center text-foreground">{subject.semester}°</td>
                        <td className="p-4 text-center">
                          <div className="flex gap-1 justify-center">
                            <button onClick={() => handleOpenEdit(subject)} className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setDeleteItem({ id: subject.id, name: subject.name, type: "subject" })} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {subjects.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">No hay materias registradas.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Periods */}
        {activeTab === "periods" && (
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-foreground">Configuración de Períodos</h3>
                  <p className="text-xs text-muted-foreground">
                    Tipo: <strong className="text-foreground">{PERIOD_TYPE_LABELS[institution.config.periodType]}</strong> · 
                    Cantidad: <strong className="text-foreground">{institution.config.periodsCount}</strong>
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {institution.config.periods.map((period) => (
                  <div key={period.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{period.order}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{period.name}</p>
                      {period.startDate && period.endDate && (
                        <p className="text-xs text-muted-foreground">{period.startDate} → {period.endDate}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {sections.filter((s) => s.periodId === period.id).length} secciones
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                <Plus className="w-4 h-4" /> Registrar Usuario
              </button>
            </div>
            <div className="glass-card rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-semibold text-foreground">Usuario</th>
                    <th className="text-left p-4 font-semibold text-foreground hidden sm:table-cell">Email</th>
                    <th className="text-center p-4 font-semibold text-foreground">Rol</th>
                    <th className="text-center p-4 font-semibold text-foreground">Estado</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-medium text-foreground">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground hidden sm:table-cell">{user.email}</td>
                      <td className="p-4 text-center">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary">{ROLE_LABELS[user.role]}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {user.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex gap-1 justify-center">
                          <button onClick={() => handleOpenEdit(user)} className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setDeleteItem({ id: user.id, name: user.name, type: "user" })} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground text-sm">No hay usuarios registrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {activeTab !== "periods" && (
        <>
          <FormDialog
            open={formOpen}
            onClose={() => { setFormOpen(false); setEditItem(null); }}
            onSave={handleSave}
            title={dialogTitle}
            fields={currentFields}
            initialData={editItem || undefined}
          />
          <DeleteDialog
            open={!!deleteItem}
            onClose={() => setDeleteItem(null)}
            onConfirm={handleDelete}
            title={`Eliminar ${deleteItem?.type === "career" ? "carrera" : deleteItem?.type === "subject" ? "materia" : "usuario"}`}
            description={`¿Estás seguro de eliminar "${deleteItem?.name}"? Esta acción no se puede deshacer.`}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export default InstitutionDetail;
