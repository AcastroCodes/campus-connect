import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockCourseSections, mockEnrollments, mockGrades, mockInstitutions } from "@/data/mockStore";
import { Grade, StudentPeriodGrade } from "@/types/dcampus";
import { ClipboardList, Download, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const Gradebook = () => {
  const [selectedSection, setSelectedSection] = useState(mockCourseSections[0]?.id || "");
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const section = mockCourseSections.find((s) => s.id === selectedSection);
  const institution = section ? mockInstitutions.find((i) => i.id === section.institutionId) : null;
  const periods = institution?.config.periods || [];

  const activePeriodId = selectedPeriod || periods[0]?.id || "";
  const activePlan = section?.evaluationPlans.find((p) => p.periodId === activePeriodId);

  const enrollments = mockEnrollments.filter((e) => e.courseSectionId === selectedSection && e.status === "active");
  const sectionGrades = mockGrades.filter((g) => g.courseSectionId === selectedSection && g.periodId === activePeriodId);

  // Build student rows
  const studentRows = enrollments.map((enrollment) => {
    const studentGrades = sectionGrades.filter((g) => g.studentId === enrollment.studentId);
    const gradeMap: Record<string, number | undefined> = {};
    studentGrades.forEach((g) => { gradeMap[g.evaluationItemId] = g.score; });

    const weightedSum = studentGrades.reduce((sum, g) => sum + (g.score / g.maxScore) * g.weight, 0);

    return {
      studentId: enrollment.studentId,
      studentName: enrollment.studentName,
      grades: gradeMap,
      weightedAverage: Math.round(weightedSum * 10) / 10,
    };
  });

  return (
    <DashboardLayout title="Cohorte de Notas">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted-foreground mb-1">Sección</label>
          <select
            value={selectedSection}
            onChange={(e) => { setSelectedSection(e.target.value); setSelectedPeriod(""); }}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground"
          >
            {mockCourseSections.map((s) => {
              const sub = s.subjectId;
              return <option key={s.id} value={s.id}>{s.teacherName} - {s.periodName} {s.year}</option>;
            })}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Período</label>
          <select
            value={activePeriodId}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground"
          >
            {periods.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20">
            <Download className="w-4 h-4" /> Exportar
          </button>
        </div>
      </div>

      {/* Grade Table */}
      {activePlan && activePlan.items.length > 0 ? (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold text-foreground sticky left-0 bg-card z-10">Estudiante</th>
                  {activePlan.items.map((item) => (
                    <th key={item.id} className="text-center p-4 font-semibold text-foreground min-w-[100px]">
                      <div className="text-xs">{item.title}</div>
                      <div className="text-xs font-normal text-muted-foreground">{item.weight}%</div>
                    </th>
                  ))}
                  <th className="text-center p-4 font-semibold text-foreground min-w-[100px] bg-primary/5">Promedio</th>
                </tr>
              </thead>
              <tbody>
                {studentRows.map((row, i) => (
                  <motion.tr
                    key={row.studentId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="p-4 sticky left-0 bg-card z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {row.studentName.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground text-xs">{row.studentName}</span>
                      </div>
                    </td>
                    {activePlan.items.map((item) => {
                      const score = row.grades[item.id];
                      return (
                        <td key={item.id} className="p-4 text-center">
                          {score !== undefined ? (
                            <span className={`text-sm font-medium ${score >= 70 ? "text-primary" : "text-destructive"}`}>{score}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-4 text-center bg-primary/5">
                      <span className={`text-sm font-bold ${row.weightedAverage >= 70 ? "text-primary" : "text-destructive"}`}>
                        {row.weightedAverage > 0 ? row.weightedAverage : "—"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-xl p-12 text-center">
          <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No hay plan de evaluación configurado para este período.</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Gradebook;
