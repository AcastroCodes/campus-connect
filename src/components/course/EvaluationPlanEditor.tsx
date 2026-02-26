import { useState } from "react";
import { EvaluationPlan, EvaluationItem, EvaluationItemType, EVALUATION_TYPE_LABELS } from "@/types/dcampus";
import { Plus, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  plans: EvaluationPlan[];
  onChange: (plans: EvaluationPlan[]) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const EvaluationPlanEditor = ({ plans, onChange }: Props) => {
  const [activePeriod, setActivePeriod] = useState(plans[0]?.periodId || "");

  const activePlan = plans.find((p) => p.periodId === activePeriod);

  const addItem = (type: EvaluationItemType) => {
    if (!activePlan) return;
    const newItem: EvaluationItem = {
      id: generateId(),
      type,
      title: "",
      description: "",
      weight: 0,
      dueDate: "",
    };
    const updated = plans.map((p) =>
      p.periodId === activePeriod
        ? { ...p, items: [...p.items, newItem], totalWeight: p.items.reduce((s, i) => s + i.weight, 0) }
        : p
    );
    onChange(updated);
  };

  const updateItem = (itemId: string, field: keyof EvaluationItem, value: string | number | boolean) => {
    const updated = plans.map((p) =>
      p.periodId === activePeriod
        ? {
            ...p,
            items: p.items.map((i) => (i.id === itemId ? { ...i, [field]: value } : i)),
            totalWeight: p.items.reduce((s, i) => s + (i.id === itemId && field === "weight" ? (value as number) : i.weight), 0),
          }
        : p
    );
    onChange(updated);
  };

  const removeItem = (itemId: string) => {
    const updated = plans.map((p) =>
      p.periodId === activePeriod
        ? {
            ...p,
            items: p.items.filter((i) => i.id !== itemId),
            totalWeight: p.items.filter((i) => i.id !== itemId).reduce((s, i) => s + i.weight, 0),
          }
        : p
    );
    onChange(updated);
  };

  const copyPlanTo = (targetPeriodId: string) => {
    if (!activePlan) return;
    const updated = plans.map((p) =>
      p.periodId === targetPeriodId
        ? {
            ...p,
            items: activePlan.items.map((i) => ({ ...i, id: generateId(), dueDate: "" })),
            totalWeight: activePlan.totalWeight,
          }
        : p
    );
    onChange(updated);
  };

  const totalWeight = activePlan?.items.reduce((s, i) => s + i.weight, 0) || 0;
  const isValid = totalWeight === 100;

  return (
    <div className="space-y-4">
      {/* Period Tabs */}
      <div className="flex gap-2 flex-wrap">
        {plans.map((plan) => {
          const pw = plan.items.reduce((s, i) => s + i.weight, 0);
          return (
            <button
              key={plan.periodId}
              onClick={() => setActivePeriod(plan.periodId)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                activePeriod === plan.periodId
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {plan.periodName}
              {plan.items.length > 0 && (
                <span className={`ml-2 text-xs ${pw === 100 ? "opacity-70" : "text-destructive"}`}>
                  {pw}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activePlan && (
        <motion.div
          key={activePeriod}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Weight indicator */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
            isValid ? "bg-primary/10 text-primary" : totalWeight > 100 ? "bg-destructive/10 text-destructive" : "bg-accent text-accent-foreground"
          }`}>
            {isValid ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>Peso total: <strong>{totalWeight}%</strong> {!isValid && "(debe sumar 100%)"}</span>
          </div>

          {/* Items */}
          <AnimatePresence mode="popLayout">
            {activePlan.items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="border border-border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary`}>
                    {EVALUATION_TYPE_LABELS[item.type]}
                  </span>
                  <input
                    type="text"
                    placeholder="Título del rubro..."
                    value={item.title}
                    onChange={(e) => updateItem(item.id, "title", e.target.value)}
                    className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={item.weight}
                      onChange={(e) => updateItem(item.id, "weight", Number(e.target.value))}
                      className="w-16 text-center bg-muted rounded-md px-2 py-1 text-sm text-foreground"
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Descripción..."
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className="flex-1 bg-transparent text-xs text-muted-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  {item.type !== "participacion" && (
                    <input
                      type="date"
                      value={item.dueDate || ""}
                      onChange={(e) => updateItem(item.id, "dueDate", e.target.value)}
                      className="text-xs bg-muted rounded-md px-2 py-1 text-foreground"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add buttons */}
          <div className="flex flex-wrap gap-2">
            {(["tarea", "examen", "participacion", "proyecto"] as EvaluationItemType[]).map((type) => (
              <button
                key={type}
                onClick={() => addItem(type)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="w-3 h-3" />
                {EVALUATION_TYPE_LABELS[type]}
              </button>
            ))}
          </div>

          {/* Copy plan */}
          {activePlan.items.length > 0 && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Copiar este plan a:</p>
              <div className="flex gap-2">
                {plans
                  .filter((p) => p.periodId !== activePeriod)
                  .map((p) => (
                    <button
                      key={p.periodId}
                      onClick={() => copyPlanTo(p.periodId)}
                      className="text-xs px-3 py-1 rounded-md bg-muted text-muted-foreground hover:bg-accent transition-colors"
                    >
                      {p.periodName}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default EvaluationPlanEditor;
