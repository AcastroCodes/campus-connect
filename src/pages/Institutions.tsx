import DashboardLayout from "@/components/DashboardLayout";
import { Building2, Plus, Globe, CheckCircle2, XCircle, Palette } from "lucide-react";
import { motion } from "framer-motion";

const mockInstitutions = [
  { id: 1, name: "Universidad del Norte", subdomain: "uninorte", isActive: true, students: 1200, courses: 45, primaryColor: "#2E9B63" },
  { id: 2, name: "Instituto Tecnológico Avanzado", subdomain: "ita", isActive: true, students: 850, courses: 32, primaryColor: "#3B82F6" },
  { id: 3, name: "Escuela de Negocios Global", subdomain: "eng", isActive: true, students: 600, courses: 18, primaryColor: "#8B5CF6" },
  { id: 4, name: "Academia de Arte Digital", subdomain: "artedigital", isActive: false, students: 320, courses: 12, primaryColor: "#F59E0B" },
  { id: 5, name: "Centro de Idiomas Internacional", subdomain: "idiomas", isActive: true, students: 950, courses: 28, primaryColor: "#EF4444" },
];

const Institutions = () => {
  return (
    <DashboardLayout title="Instituciones">
      <div className="flex justify-end mb-6">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Nueva Institución
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockInstitutions.map((inst, i) => (
          <motion.div
            key={inst.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-xl overflow-hidden hover:border-primary/20 transition-all cursor-pointer"
          >
            <div className="h-2" style={{ backgroundColor: inst.primaryColor }} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${inst.primaryColor}15` }}>
                    <Building2 className="w-5 h-5" style={{ color: inst.primaryColor }} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-sm">{inst.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {inst.subdomain}.dcampus.com
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                <span>{inst.students} estudiantes</span>
                <span>{inst.courses} cursos</span>
                <span className="ml-auto flex items-center gap-1">
                  {inst.isActive ? (
                    <><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Activa</>
                  ) : (
                    <><XCircle className="w-3.5 h-3.5 text-destructive" /> Inactiva</>
                  )}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Institutions;
