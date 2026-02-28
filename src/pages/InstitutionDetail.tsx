import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { mockInstitutions, mockCareers, mockSubjects, mockCourseSections, mockUsers, getInstitutionStats } from "@/data/mockStore";
import { PERIOD_TYPE_LABELS, Career, Subject } from "@/types/dcampus";
import { ArrowLeft, GraduationCap, BookOpen, Users, Briefcase, Calendar, Plus, Pencil, Trash2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const InstitutionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const institution = mockInstitutions.find((i) => i.id === id);
  const [activeTab, setActiveTab] = useState<"careers" | "subjects" | "periods" | "users">("careers");

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
  const careers = mockCareers.filter((c) => c.institutionId === institution.id);
  const subjects = mockSubjects.filter((s) => s.institutionId === institution.id);
  const users = mockUsers.filter((u) => u.institutionId === institution.id);
  const sections = mockCourseSections.filter((s) => s.institutionId === institution.id);

  const tabs = [
    { key: "careers" as const, label: "Carreras", count: careers.length, icon: GraduationCap },
    { key: "subjects" as const, label: "Materias", count: subjects.length, icon: BookOpen },
    { key: "periods" as const, label: "Períodos", count: institution.config.periodsCount, icon: Calendar },
    { key: "users" as const, label: "Usuarios", count: users.length, icon: Users },
  ];

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
              { label: "Carreras", value: stats.careersCount },
              { label: "Materias", value: stats.subjectsCount },
              { label: "Secciones", value: stats.sectionsCount },
              { label: "Estudiantes", value: stats.studentsCount },
              { label: "Profesores", value: stats.teachersCount },
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
            <span className="text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded-full">{tab.count}</span>
          </button>
        ))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
        {/* Careers */}
        {activeTab === "careers" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => toast({ title: "Crear carrera", description: "Funcionalidad mock" })} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                <Plus className="w-4 h-4" /> Nueva Carrera
              </button>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {careers.map((career, i) => (
                <motion.div key={career.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-xl p-5 hover:border-primary/20 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs font-mono text-muted-foreground">{career.code}</span>
                      <h3 className="font-display font-semibold text-foreground text-sm">{career.name}</h3>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{career.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{career.subjectsCount} materias</span>
                    <span>{career.studentsCount} estudiantes</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Subjects */}
        {activeTab === "subjects" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => toast({ title: "Crear materia", description: "Funcionalidad mock" })} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
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
                    const career = mockCareers.find((c) => c.id === subject.careerId);
                    return (
                      <tr key={subject.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-mono text-xs text-muted-foreground">{subject.code}</td>
                        <td className="p-4 font-medium text-foreground">{subject.name}</td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">{career?.name || "-"}</td>
                        <td className="p-4 text-center text-foreground">{subject.credits}</td>
                        <td className="p-4 text-center text-foreground">{subject.semester}°</td>
                        <td className="p-4 text-center">
                          <div className="flex gap-1 justify-center">
                            <button className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20">
                  <Pencil className="w-3 h-3" /> Editar configuración
                </button>
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
              <button onClick={() => toast({ title: "Registrar usuario", description: "Funcionalidad mock" })} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
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
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary capitalize">{user.role}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {user.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default InstitutionDetail;
