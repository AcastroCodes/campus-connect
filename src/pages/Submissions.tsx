import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockSubmissions, mockCourseSections } from "@/data/mockStore";
import { RESOURCE_PROVIDER_LABELS } from "@/types/dcampus";
import { FileText, ExternalLink, CheckCircle2, Clock, Search, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const Submissions = () => {
  const [search, setSearch] = useState("");
  const [filterGraded, setFilterGraded] = useState<"all" | "graded" | "pending">("all");

  const filtered = mockSubmissions.filter((s) => {
    const matchSearch = s.studentName.toLowerCase().includes(search.toLowerCase());
    const matchGraded = filterGraded === "all" || (filterGraded === "graded" ? s.grade !== undefined : s.grade === undefined);
    return matchSearch && matchGraded;
  });

  return (
    <DashboardLayout title="Entregas de Estudiantes">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por estudiante..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "graded"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterGraded(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterGraded === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
            >
              {f === "all" ? "Todas" : f === "graded" ? "Calificadas" : "Pendientes"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((submission, i) => (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="glass-card rounded-xl p-5 hover:border-primary/20 transition-all"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-semibold text-foreground text-sm">{submission.studentName}</h3>
                  {submission.grade !== undefined ? (
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 className="w-3 h-3" /> {submission.grade}/100
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                      <Clock className="w-3 h-3" /> Pendiente
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Entregado: {new Date(submission.submittedAt).toLocaleString("es-ES")} · 
                  Vía {RESOURCE_PROVIDER_LABELS[submission.linkProvider]}
                </p>
                {submission.comment && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> {submission.comment}
                  </p>
                )}
                {submission.feedback && (
                  <p className="text-xs text-primary mt-1">Feedback: {submission.feedback}</p>
                )}
              </div>
              <a
                href={submission.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Ver entrega
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Submissions;
