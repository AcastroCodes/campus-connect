// ========== Core Types ==========

export type PeriodType = "trimestre" | "bimestre" | "semestre" | "cuatrimestre";

export interface AcademicPeriod {
  id: string;
  name: string; // e.g. "Trimestre 1"
  order: number;
}

export interface InstitutionConfig {
  periodType: PeriodType;
  periodsCount: number;
  periods: AcademicPeriod[];
}

// ========== Course Types ==========

export interface Lesson {
  id: string;
  title: string;
  contentText: string;
  videoProvider: "youtube" | "vimeo" | "none";
  videoId: string;
  isFree: boolean;
  sortOrder: number;
}

export interface Module {
  id: string;
  title: string;
  sortOrder: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  accentColor: string;
  welcomeMessage: string;
  teacherId: string;
  teacherName: string;
  status: "active" | "draft" | "archived";
  modules: Module[];
  evaluationPlans: EvaluationPlan[];
  studentsCount: number;
  createdAt: string;
}

// ========== Evaluation Types ==========

export type EvaluationItemType = "tarea" | "examen" | "participacion" | "proyecto";

export interface EvaluationItem {
  id: string;
  type: EvaluationItemType;
  title: string;
  description: string;
  weight: number; // percentage 0-100
  dueDate?: string;
}

export interface EvaluationPlan {
  id: string;
  periodId: string;
  periodName: string;
  items: EvaluationItem[];
  totalWeight: number; // computed, should be 100
}

// ========== Helpers ==========

export const EVALUATION_TYPE_LABELS: Record<EvaluationItemType, string> = {
  tarea: "Tarea",
  examen: "Examen",
  participacion: "Participación",
  proyecto: "Proyecto",
};

export const EVALUATION_TYPE_COLORS: Record<EvaluationItemType, string> = {
  tarea: "hsl(var(--primary))",
  examen: "hsl(var(--destructive))",
  participacion: "hsl(var(--chart-4))",
  proyecto: "hsl(var(--chart-2))",
};

export const PERIOD_TYPE_LABELS: Record<PeriodType, string> = {
  trimestre: "Trimestre",
  bimestre: "Bimestre",
  semestre: "Semestre",
  cuatrimestre: "Cuatrimestre",
};
