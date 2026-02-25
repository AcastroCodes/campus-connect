import { ReactNode } from "react";

interface StatsCardProps {
  value: string | number;
  label: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: string;
}

const StatsCard = ({ value, label, subtitle, icon, trend }: StatsCardProps) => {
  return (
    <div className="glass-card rounded-xl p-5 transition-all hover:border-primary/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-3xl font-display font-bold text-primary">{value}</p>
          <p className="text-sm font-semibold text-foreground mt-1">{label}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
