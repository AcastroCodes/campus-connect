import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockLiveSessions as initialSessions, mockAttendance, mockCourseSections } from "@/data/mockStore";
import { LiveSession, LIVE_PLATFORM_LABELS, LivePlatform } from "@/types/dcampus";
import { FormDialog, DeleteDialog } from "@/components/CrudDialog";
import { Video, Plus, Clock, ExternalLink, CheckCircle2, XCircle, AlertCircle, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const gid = () => Math.random().toString(36).substr(2, 9);

const LiveSessions = () => {
  const [sessions, setSessions] = useState<LiveSession[]>([...initialSessions]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<LiveSession | null>(null);
  const [deleteItem, setDeleteItem] = useState<LiveSession | null>(null);

  const sessionAttendance = selectedSession ? mockAttendance.filter((a) => a.liveSessionId === selectedSession) : [];

  const fields = [
    { key: "title", label: "Título", placeholder: "Ej: Introducción a React Hooks", required: true },
    { key: "platform", label: "Plataforma", type: "select" as const, options: (["zoom", "meet", "jitsi"] as LivePlatform[]).map((p) => ({ value: p, label: LIVE_PLATFORM_LABELS[p] })) },
    { key: "meetingUrl", label: "URL de la reunión", placeholder: "https://zoom.us/j/..." },
    { key: "scheduledAt", label: "Fecha y hora", placeholder: "2026-03-15T10:00:00" },
    { key: "durationMinutes", label: "Duración (min)", type: "number" as const, placeholder: "90" },
    { key: "courseSectionId", label: "Sección", type: "select" as const, options: mockCourseSections.map((cs) => ({ value: cs.id, label: `${cs.teacherName} - ${cs.periodName}` })) },
  ];

  const handleSave = (data: Record<string, any>) => {
    const cs = mockCourseSections.find((c) => c.id === data.courseSectionId);
    if (editItem) {
      setSessions((prev) => prev.map((s) => s.id === editItem.id ? {
        ...s, title: data.title, platform: data.platform as LivePlatform, meetingUrl: data.meetingUrl,
        scheduledAt: data.scheduledAt, durationMinutes: Number(data.durationMinutes),
        courseSectionId: data.courseSectionId, courseName: cs?.teacherName || s.courseName,
      } : s));
      toast({ title: "Sesión actualizada", description: `"${data.title}" fue actualizada.` });
    } else {
      const newSession: LiveSession = {
        id: gid(), title: data.title, platform: (data.platform as LivePlatform) || "zoom",
        meetingUrl: data.meetingUrl || "", scheduledAt: data.scheduledAt || new Date().toISOString(),
        durationMinutes: Number(data.durationMinutes) || 60, status: "scheduled",
        courseSectionId: data.courseSectionId || "", teacherId: "", teacherName: cs?.teacherName || "",
        courseName: cs?.periodName || "",
      };
      setSessions((prev) => [...prev, newSession]);
      toast({ title: "Sesión programada", description: `"${data.title}" fue creada.` });
    }
    setEditItem(null);
  };

  const handleDelete = () => {
    if (deleteItem) {
      setSessions((prev) => prev.filter((s) => s.id !== deleteItem.id));
      toast({ title: "Sesión eliminada", description: `"${deleteItem.title}" fue eliminada.` });
      setDeleteItem(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "attended": return { icon: CheckCircle2, label: "Asistió", cls: "bg-primary/10 text-primary" };
      case "confirmed": return { icon: AlertCircle, label: "Confirmó", cls: "bg-accent text-accent-foreground" };
      case "absent": return { icon: XCircle, label: "Ausente", cls: "bg-destructive/10 text-destructive" };
      default: return { icon: Clock, label: "Pendiente", cls: "bg-muted text-muted-foreground" };
    }
  };

  return (
    <DashboardLayout title="Sesiones en Vivo">
      <div className="flex justify-end mb-6">
        <button onClick={() => { setEditItem(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Programar Sesión
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className={`${selectedSession ? "lg:col-span-3" : "lg:col-span-5"} space-y-4`}>
          {sessions.map((session, i) => (
            <motion.div key={session.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedSession(session.id === selectedSession ? null : session.id)}
              className={`glass-card rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-primary/20 transition-all cursor-pointer ${
                selectedSession === session.id ? "border-primary/30 ring-1 ring-primary/20" : ""
              }`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${session.status === "live" ? "bg-destructive/10" : "bg-primary/10"}`}>
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
                <p className="text-xs text-muted-foreground mt-0.5">{session.courseName} · {session.teacherName}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(session.scheduledAt).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}</span>
                  <span>{session.durationMinutes} min</span>
                  <span className="px-1.5 py-0.5 rounded bg-muted text-xs">{LIVE_PLATFORM_LABELS[session.platform]}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); setEditItem(session); setFormOpen(true); }} className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={(e) => { e.stopPropagation(); setDeleteItem(session); }} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                {session.status === "live" ? (
                  <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-xs font-medium hover:opacity-90 shrink-0"
                    onClick={(e) => e.stopPropagation()}>
                    <ExternalLink className="w-3.5 h-3.5" /> Unirse
                  </a>
                ) : (
                  <span className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground shrink-0">
                    {session.status === "scheduled" ? "Programada" : session.status === "completed" ? "Finalizada" : "Cancelada"}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
          {sessions.length === 0 && (
            <div className="glass-card rounded-xl p-12 text-center text-muted-foreground text-sm">No hay sesiones programadas.</div>
          )}
        </div>

        {selectedSession && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
            <div className="glass-card rounded-xl p-5 sticky top-20">
              <h3 className="font-display font-semibold text-foreground text-sm mb-4">Asistencia ({sessionAttendance.length})</h3>
              <div className="space-y-2">
                {sessionAttendance.map((att) => {
                  const badge = getStatusBadge(att.status);
                  const BadgeIcon = badge.icon;
                  return (
                    <div key={att.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{att.studentName.charAt(0)}</div>
                      <span className="flex-1 text-sm text-foreground">{att.studentName}</span>
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${badge.cls}`}><BadgeIcon className="w-3 h-3" /> {badge.label}</span>
                    </div>
                  );
                })}
                {sessionAttendance.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Sin registros de asistencia</p>}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <FormDialog open={formOpen} onClose={() => { setFormOpen(false); setEditItem(null); }} onSave={handleSave}
        title={editItem ? "Editar Sesión" : "Programar Sesión"} fields={fields} initialData={editItem || undefined} />
      <DeleteDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete}
        title="Eliminar sesión" description={`¿Estás seguro de eliminar "${deleteItem?.title}"?`} />
    </DashboardLayout>
  );
};

export default LiveSessions;
