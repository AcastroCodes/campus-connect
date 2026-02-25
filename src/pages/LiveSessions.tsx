import DashboardLayout from "@/components/DashboardLayout";
import { Video, Plus, Clock, Users, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const mockSessions = [
  { id: 1, title: "Introducción a React Hooks", course: "Desarrollo Web Full Stack", teacher: "Prof. Carlos López", time: "10:00 AM - 11:30 AM", date: "Hoy", students: 28, status: "live" },
  { id: 2, title: "Principios de Diseño Visual", course: "Diseño UX/UI Avanzado", teacher: "Dra. Ana Ríos", time: "2:00 PM - 3:30 PM", date: "Hoy", students: 15, status: "scheduled" },
  { id: 3, title: "Redes Neuronales", course: "Machine Learning Básico", teacher: "Dr. Luis Mendez", time: "9:00 AM - 10:30 AM", date: "Mañana", students: 22, status: "scheduled" },
  { id: 4, title: "SEO y Analytics", course: "Marketing Digital", teacher: "Prof. María Torres", time: "4:00 PM - 5:00 PM", date: "Mañana", students: 40, status: "scheduled" },
  { id: 5, title: "Bases de Datos NoSQL", course: "Desarrollo Web Full Stack", teacher: "Prof. Carlos López", time: "11:00 AM - 12:30 PM", date: "26 Feb", students: 30, status: "scheduled" },
];

const LiveSessions = () => {
  return (
    <DashboardLayout title="Sesiones en Vivo">
      <div className="flex justify-end mb-6">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Programar Sesión
        </button>
      </div>

      <div className="space-y-4">
        {mockSessions.map((session, i) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-primary/20 transition-all"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
              session.status === "live" ? "bg-destructive/10" : "bg-primary/10"
            }`}>
              <Video className={`w-5 h-5 ${session.status === "live" ? "text-destructive" : "text-primary"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-foreground text-sm truncate">{session.title}</h3>
                {session.status === "live" && (
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" /> EN VIVO
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{session.course} · {session.teacher}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {session.date}, {session.time}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {session.students} inscritos</span>
              </div>
            </div>
            {session.status === "live" ? (
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-xs font-medium hover:opacity-90 transition-opacity shrink-0">
                <ExternalLink className="w-3.5 h-3.5" /> Unirse
              </button>
            ) : (
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/80 transition-colors shrink-0">
                <Clock className="w-3.5 h-3.5" /> Programada
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default LiveSessions;
