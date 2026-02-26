import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import ModuleEditor from "@/components/course/ModuleEditor";
import EvaluationPlanEditor from "@/components/course/EvaluationPlanEditor";
import { Course, Module, EvaluationPlan } from "@/types/dcampus";
import { mockCourses, institutionConfig, createEmptyEvaluationPlans } from "@/data/mockCourseStore";
import { ArrowLeft, Save, BookOpen, ClipboardList, Info } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

type Tab = "info" | "content" | "evaluation";

const CourseBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [accentColor, setAccentColor] = useState("#2E9B63");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [status, setStatus] = useState<"active" | "draft">("draft");
  const [modules, setModules] = useState<Module[]>([]);
  const [evalPlans, setEvalPlans] = useState<EvaluationPlan[]>(
    createEmptyEvaluationPlans(institutionConfig.periods)
  );

  useEffect(() => {
    if (isEdit) {
      const course = mockCourses.find((c) => c.id === id);
      if (course) {
        setTitle(course.title);
        setDescription(course.description);
        setAccentColor(course.accentColor);
        setWelcomeMessage(course.welcomeMessage);
        setStatus(course.status === "archived" ? "draft" : course.status);
        setModules(course.modules);
        setEvalPlans(course.evaluationPlans);
      }
    }
  }, [id, isEdit]);

  const handleSave = () => {
    if (!title.trim()) {
      toast({ title: "Error", description: "El título del curso es obligatorio", variant: "destructive" });
      return;
    }
    toast({ title: isEdit ? "Curso actualizado" : "Curso creado", description: `"${title}" guardado exitosamente.` });
    navigate("/courses");
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "info", label: "Información", icon: Info },
    { key: "content", label: "Contenido", icon: BookOpen },
    { key: "evaluation", label: "Evaluación", icon: ClipboardList },
  ];

  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);

  return (
    <DashboardLayout title={isEdit ? "Editar Curso" : "Nuevo Curso"}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/courses")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a cursos
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Save className="w-4 h-4" /> Guardar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
        {/* Info Tab */}
        {activeTab === "info" && (
          <div className="glass-card rounded-xl p-6 space-y-5 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Título del curso *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Desarrollo Web Full Stack"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe el contenido y objetivos del curso..."
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Mensaje de bienvenida</label>
              <textarea
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                rows={2}
                placeholder="Mensaje que verán los estudiantes al inscribirse..."
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Color de acento</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                  />
                  <span className="text-xs text-muted-foreground font-mono">{accentColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Estado</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "active" | "draft")}
                  className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground"
                >
                  <option value="draft">Borrador</option>
                  <option value="active">Activo</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{modules.length} módulos</span>
              <span>{totalLessons} lecciones</span>
            </div>
            <ModuleEditor modules={modules} onChange={setModules} />
          </div>
        )}

        {/* Evaluation Tab */}
        {activeTab === "evaluation" && (
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">
                Períodos configurados: <strong className="text-foreground">{institutionConfig.periodsCount} {institutionConfig.periodType}s</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                Cada período tiene su propio plan de evaluación independiente. Los pesos deben sumar 100%.
              </p>
            </div>
            <EvaluationPlanEditor plans={evalPlans} onChange={setEvalPlans} />
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default CourseBuilder;
