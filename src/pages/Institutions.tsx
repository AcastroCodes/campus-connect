import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { mockInstitutions, getInstitutionStats } from "@/data/mockStore";
import { Building2, Plus, Globe, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const Institutions = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="Instituciones">
      <div className="flex justify-end mb-6">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Nueva Institución
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockInstitutions.map((inst, i) => {
          const stats = getInstitutionStats(inst.id);
          return (
            <motion.div
              key={inst.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/institutions/${inst.id}`)}
              className="glass-card rounded-xl overflow-hidden hover:border-primary/20 transition-all cursor-pointer group"
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
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-xs text-muted-foreground mb-3">Admin: {inst.adminName}</p>
                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div><p className="text-sm font-bold text-foreground">{stats.careersCount}</p><p className="text-xs text-muted-foreground">Carreras</p></div>
                  <div><p className="text-sm font-bold text-foreground">{stats.studentsCount}</p><p className="text-xs text-muted-foreground">Alumnos</p></div>
                  <div><p className="text-sm font-bold text-foreground">{stats.subjectsCount}</p><p className="text-xs text-muted-foreground">Materias</p></div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                  <span>Tasa de entregas: {stats.submissionRate}%</span>
                  <span className="flex items-center gap-1">
                    {inst.isActive ? (
                      <><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Activa</>
                    ) : (
                      <><XCircle className="w-3.5 h-3.5 text-destructive" /> Inactiva</>
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default Institutions;
