import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Moon, Sun, GraduationCap, BookOpen, Users, Video, BarChart3,
  ArrowRight, CheckCircle2, Building2, Shield, ClipboardList,
  Layers, UserCheck, FileText
} from "lucide-react";
import { motion } from "framer-motion";

const Landing = () => {
  const { theme, toggleTheme } = useTheme();

  const features = [
    { icon: Building2, title: "Multi-Instituto", desc: "Cada institución opera de forma independiente con su identidad, carreras y períodos académicos." },
    { icon: Layers, title: "Pensum & Materias", desc: "Define la estructura curricular completa: carreras, pensum y materias con contenido multimedia." },
    { icon: ClipboardList, title: "Planes de Evaluación", desc: "Plan base por materia personalizable por el profesor. Tareas, exámenes, proyectos y participación." },
    { icon: Video, title: "Clases en Vivo", desc: "Integración con Zoom, Google Meet y Jitsi. Confirmación de asistencia automática." },
    { icon: BarChart3, title: "Cohorte de Notas", desc: "Seguimiento de calificaciones por período con promedios ponderados y cierre de actas." },
    { icon: Shield, title: "Roles Jerárquicos", desc: "SuperAdmin, Director, Control de Estudio, Profesor y Estudiante con permisos específicos." },
  ];

  const roles = [
    { icon: Shield, role: "SuperAdmin", desc: "Crea institutos y asigna directores. Control total de la plataforma." },
    { icon: Building2, role: "Director", desc: "Define carreras, materias, períodos y registra usuarios del instituto." },
    { icon: UserCheck, role: "Control de Estudio", desc: "Supervisa planes de evaluación y genera el cohorte de notas." },
    { icon: BookOpen, role: "Profesor", desc: "Crea contenido, personaliza planes de evaluación y dicta clases en vivo." },
    { icon: Users, role: "Estudiante", desc: "Accede a materias inscritas, entrega tareas y consulta sus calificaciones." },
  ];

  const flow = [
    { step: "01", title: "Crear Instituto", desc: "SuperAdmin registra la institución y asigna un Director." },
    { step: "02", title: "Estructura Académica", desc: "Director configura carreras, pensum, materias y períodos." },
    { step: "03", title: "Asignar Secciones", desc: "Se crean secciones vinculando materia + profesor + período." },
    { step: "04", title: "Contenido y Evaluación", desc: "Profesor personaliza el plan base, sube videos y recursos." },
    { step: "05", title: "Entregas y Notas", desc: "Estudiantes entregan tareas. Control de Estudio cierra actas." },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">D'Campus</span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <Link to="/login" className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
              🎓 LMS Multi-Instituto
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight mb-6">
              Gestión académica{" "}
              <span className="text-gradient">integral</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Desde la creación del instituto hasta el cierre de actas de notas.
              Carreras, pensum, evaluación y clases en vivo en una sola plataforma.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                Comenzar ahora <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">
            Módulos del Sistema
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            Cada módulo diseñado para cubrir el flujo académico completo de múltiples instituciones.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">
            Jerarquía de Roles
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            Cinco niveles de acceso con permisos específicos para cada función dentro del instituto.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {roles.map((r, i) => (
              <motion.div
                key={r.role}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass-card rounded-xl p-5 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <r.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-display font-semibold text-foreground text-sm mb-1">{r.role}</h4>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-display font-bold text-center text-foreground mb-12">
            Flujo de Usuario
          </h2>
          <div className="space-y-6">
            {flow.map((f, i) => (
              <motion.div
                key={f.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary-foreground">{f.step}</span>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground mb-1">{f.title}</h4>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © 2026 D'Campus. Plataforma LMS Multi-Instituto.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
