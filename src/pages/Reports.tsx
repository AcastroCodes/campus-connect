import DashboardLayout from "@/components/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const enrollmentData = [
  { month: "Ene", value: 120 }, { month: "Feb", value: 180 }, { month: "Mar", value: 150 },
  { month: "Abr", value: 200 }, { month: "May", value: 170 }, { month: "Jun", value: 220 },
];

const courseDistribution = [
  { name: "Tecnología", value: 35 },
  { name: "Diseño", value: 20 },
  { name: "Negocios", value: 25 },
  { name: "Idiomas", value: 20 },
];

const revenueData = [
  { month: "Ene", revenue: 8500 }, { month: "Feb", revenue: 12000 }, { month: "Mar", revenue: 9800 },
  { month: "Abr", revenue: 15000 }, { month: "May", revenue: 11200 }, { month: "Jun", revenue: 18000 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

const Reports = () => {
  return (
    <DashboardLayout title="Reportes">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Enrollment trend */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-base font-display font-semibold text-foreground mb-4">Tendencia de Matrículas</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course distribution */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-base font-display font-semibold text-foreground mb-4">Distribución por Categoría</h3>
          <div className="h-56 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={courseDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {courseDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue */}
        <div className="glass-card rounded-xl p-5 lg:col-span-2">
          <h3 className="text-base font-display font-semibold text-foreground mb-4">Ingresos Mensuales</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(v: number) => [`$${v.toLocaleString()}`, "Ingresos"]} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
