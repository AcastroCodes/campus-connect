import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { mockInstitutions, getInstitutionStats, mockSubmissions, mockCourseSections } from "@/data/mockStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const Reports = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superadmin";

  // Per-institution stats for superadmin
  const institutionData = mockInstitutions.map((inst) => {
    const stats = getInstitutionStats(inst.id);
    return { name: inst.name.split(" ").slice(0, 2).join(" "), students: stats.studentsCount, subjects: stats.subjectsCount, sections: stats.sectionsCount, rate: stats.submissionRate };
  });

  // Submission stats
  const totalSubmissions = mockSubmissions.length;
  const gradedSubmissions = mockSubmissions.filter((s) => s.grade !== undefined).length;
  const pendingSubmissions = totalSubmissions - gradedSubmissions;
  const avgGrade = gradedSubmissions > 0 ? Math.round(mockSubmissions.filter((s) => s.grade !== undefined).reduce((sum, s) => sum + (s.grade || 0), 0) / gradedSubmissions) : 0;

  const submissionPie = [
    { name: "Calificadas", value: gradedSubmissions },
    { name: "Pendientes", value: pendingSubmissions },
  ];

  const enrollmentData = [
    { month: "Ene", value: 120 }, { month: "Feb", value: 180 }, { month: "Mar", value: 150 },
    { month: "Abr", value: 200 }, { month: "May", value: 170 }, { month: "Jun", value: 220 },
  ];

  return (
    <DashboardLayout title="Reportes">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Institution comparison (superadmin) or Enrollment trend */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-base font-display font-semibold text-foreground mb-4">
            {isSuperAdmin ? "Alumnos por Institución" : "Tendencia de Matrículas"}
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={isSuperAdmin ? institutionData : enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey={isSuperAdmin ? "name" : "month"} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey={isSuperAdmin ? "students" : "value"} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Submission stats */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-base font-display font-semibold text-foreground mb-4">Estado de Entregas</h3>
          <div className="h-56 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={submissionPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {submissionPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade distribution */}
        <div className="glass-card rounded-xl p-5 lg:col-span-2">
          <h3 className="text-base font-display font-semibold text-foreground mb-4">
            {isSuperAdmin ? "Tasa de Entregas por Institución" : "Métricas Generales"}
          </h3>
          {isSuperAdmin ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={institutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(v: number) => [`${v}%`, "Tasa"]} />
                  <Bar dataKey="rate" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-display font-bold text-foreground">{totalSubmissions}</p>
                <p className="text-xs text-muted-foreground">Total Entregas</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-display font-bold text-primary">{gradedSubmissions}</p>
                <p className="text-xs text-muted-foreground">Calificadas</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-display font-bold text-accent-foreground">{pendingSubmissions}</p>
                <p className="text-xs text-muted-foreground">Pendientes</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-display font-bold text-foreground">{avgGrade}</p>
                <p className="text-xs text-muted-foreground">Promedio General</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
