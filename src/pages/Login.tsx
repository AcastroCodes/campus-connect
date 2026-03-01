import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { GraduationCap, Moon, Sun, Eye, EyeOff, Shield, Building2, UserCheck, BookOpen, Users } from "lucide-react";
import { motion } from "framer-motion";

const DEMO_ACCOUNTS = [
  { email: "super@dcampus.com", role: "SuperAdmin", icon: Shield, color: "hsl(var(--destructive))" },
  { email: "admin@dcampus.com", role: "Director", icon: Building2, color: "hsl(var(--primary))" },
  { email: "coord@dcampus.com", role: "Control de Estudio", icon: UserCheck, color: "hsl(var(--chart-4))" },
  { email: "teacher@dcampus.com", role: "Profesor", icon: BookOpen, color: "hsl(var(--chart-3))" },
  { email: "student@dcampus.com", role: "Estudiante", icon: Users, color: "hsl(var(--accent))" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Credenciales inválidas");
      }
    } catch {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setLoading(true);
    setError("");
    try {
      const success = await login(demoEmail, "password");
      if (success) navigate("/dashboard");
    } catch {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary-foreground/20 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-primary-foreground/10 blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-8">
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-display font-bold text-primary-foreground mb-4">
            Bienvenido a D'Campus
          </h2>
          <p className="text-primary-foreground/70 text-lg mb-8">
            Gestión académica integral multi-instituto
          </p>
          {/* Demo role cards */}
          <div className="space-y-2 max-w-xs mx-auto">
            <p className="text-primary-foreground/50 text-xs font-medium uppercase tracking-wider mb-3">Acceso rápido demo</p>
            {DEMO_ACCOUNTS.map((demo) => (
              <button
                key={demo.email}
                onClick={() => handleDemoLogin(demo.email)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors text-left"
              >
                <demo.icon className="w-4 h-4 text-primary-foreground/80 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-foreground">{demo.role}</p>
                  <p className="text-xs text-primary-foreground/50 truncate">{demo.email}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-4 relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Volver
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">D'Campus</span>
          </div>

          <h1 className="text-2xl font-display font-bold text-foreground mb-1">Iniciar Sesión</h1>
          <p className="text-sm text-muted-foreground mb-8">Ingresa tus credenciales para acceder</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          {/* Mobile demo cards */}
          <div className="mt-6 lg:hidden">
            <p className="text-xs text-muted-foreground font-medium mb-3">Acceso rápido demo:</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((demo) => (
                <button
                  key={demo.email}
                  onClick={() => handleDemoLogin(demo.email)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-left"
                >
                  <demo.icon className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="text-xs font-medium text-foreground">{demo.role}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
