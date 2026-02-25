import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, GraduationCap, BookOpen, Users, Video, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const Landing = () => {
  const { theme, toggleTheme } = useTheme();

  const features = [
    { icon: BookOpen, title: "Gestión de Cursos", desc: "Crea y organiza cursos con módulos y lecciones multimedia." },
    { icon: Video, title: "Clases en Vivo", desc: "Integración con Jitsi para videoconferencias sin costos extra." },
    { icon: Users, title: "Multi-Tenant", desc: "Cada institución con su propia identidad y datos aislados." },
    { icon: BarChart3, title: "Reportes", desc: "Seguimiento del progreso de estudiantes en tiempo real." },
  ];

  const benefits = [
    "Zero-Load Architecture",
    "White-labeling completo",
    "Videos externos (YouTube/Vimeo)",
    "Sistema de evaluaciones",
    "Comunidad y Q&A",
    "Roles y permisos",
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
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <Link
              to="/login"
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
              🎓 SaaS LMS Multi-tenant
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight mb-6">
              Tu plataforma educativa{" "}
              <span className="text-gradient">sin límites</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Zero-Load Architecture: Sin costos de streaming. Integra YouTube, Vimeo y Jitsi. 
              Cada institución con su propia identidad.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Comenzar ahora <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold text-center text-foreground mb-12">
            Todo lo que necesitas
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
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

      {/* Benefits */}
      <section className="py-20 px-4 bg-secondary/50">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-display font-bold text-foreground mb-10">
            Arquitectura pensada para escalar
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-3 p-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-foreground font-medium">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © 2026 D'Campus. Plataforma LMS Multi-tenant.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
