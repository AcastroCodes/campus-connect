import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { mockCurriculums, mockCareers, mockSubjects } from "@/data/mockStore";
import { Layers, BookOpen, ChevronRight, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CurriculumPage = () => {
  const { user } = useAuth();
  const instId = user?.institutionId;

  const curriculums = mockCurriculums.filter((c) => c.institutionId === instId);

  return (
    <DashboardLayout title="Pensum / Curriculum">
      <div className="space-y-6">
        {curriculums.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display font-semibold text-foreground mb-2">Sin pensum configurado</h3>
            <p className="text-sm text-muted-foreground">No hay curriculums registrados para esta institución.</p>
          </div>
        ) : (
          curriculums.map((cur) => {
            const career = mockCareers.find((c) => c.id === cur.careerId);
            const semesters = [...new Set(cur.entries.map((e) => e.semester))].sort((a, b) => a - b);

            return (
              <motion.div
                key={cur.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <div className="p-5 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-foreground">
                      {career?.name || "Carrera"} — {cur.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {cur.entries.length} materias · {semesters.length} semestres · {cur.isActive ? "Activo" : "Inactivo"}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    cur.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {cur.year}
                  </span>
                </div>

                <div className="p-5">
                  {semesters.map((sem) => {
                    const entries = cur.entries.filter((e) => e.semester === sem);
                    return (
                      <div key={sem} className="mb-4 last:mb-0">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Semestre {sem}
                        </h4>
                        <div className="space-y-1.5">
                          {entries.map((entry) => {
                            const subject = mockSubjects.find((s) => s.id === entry.subjectId);
                            const prereqNames = entry.prerequisites
                              .map((pid) => mockSubjects.find((s) => s.id === pid)?.name)
                              .filter(Boolean);

                            return (
                              <div
                                key={entry.id}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                              >
                                <BookOpen className="w-4 h-4 text-primary shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-foreground">{subject?.name}</span>
                                    <span className="text-xs text-muted-foreground font-mono">{subject?.code}</span>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span>{subject?.credits} créditos</span>
                                    {entry.isRequired ? (
                                      <span className="flex items-center gap-0.5 text-primary"><CheckCircle2 className="w-3 h-3" /> Obligatoria</span>
                                    ) : (
                                      <span className="flex items-center gap-0.5"><Circle className="w-3 h-3" /> Electiva</span>
                                    )}
                                    {prereqNames.length > 0 && (
                                      <span className="flex items-center gap-0.5">
                                        <ArrowRight className="w-3 h-3" /> Prerequisito: {prereqNames.join(", ")}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
};

export default CurriculumPage;
