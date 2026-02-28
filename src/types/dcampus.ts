// ========== Core Types ==========

export type PeriodType = "trimestre" | "bimestre" | "semestre" | "cuatrimestre";
export type UserRole = "superadmin" | "admin" | "coordinator" | "teacher" | "student";

export interface AcademicPeriod {
  id: string;
  name: string;
  order: number;
  startDate?: string;
  endDate?: string;
}

export interface InstitutionConfig {
  periodType: PeriodType;
  periodsCount: number;
  periods: AcademicPeriod[];
}

// ========== Institution & Organizational ==========

export interface Institution {
  id: string;
  name: string;
  subdomain: string;
  isActive: boolean;
  primaryColor: string;
  logo?: string;
  adminId: string;
  adminName: string;
  config: InstitutionConfig;
  createdAt: string;
}

export interface Career {
  id: string;
  institutionId: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  subjectsCount: number;
  studentsCount: number;
}

export interface Subject {
  id: string;
  careerId: string;
  institutionId: string;
  name: string;
  code: string;
  credits: number;
  semester: number; // suggested semester in the career plan
  isActive: boolean;
}

export interface CourseSection {
  id: string;
  subjectId: string;
  institutionId: string;
  periodId: string;
  periodName: string;
  teacherId: string;
  teacherName: string;
  accentColor: string;
  welcomeMessage: string;
  status: "active" | "draft" | "archived";
  modules: Module[];
  evaluationPlans: EvaluationPlan[];
  enrollmentsCount: number;
  year: number;
}

// ========== User & Enrollment ==========

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  institutionId: string;
  role: UserRole;
  isActive: boolean;
}

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseSectionId: string;
  enrolledAt: string;
  status: "active" | "dropped" | "completed";
}

// ========== Course Content ==========

export type ResourceProvider = "youtube" | "vimeo" | "drive" | "mega" | "mediafire" | "external" | "none";

export interface Lesson {
  id: string;
  title: string;
  contentText: string;
  videoProvider: ResourceProvider;
  videoId: string;
  isFree: boolean;
  sortOrder: number;
  resources: LessonResource[];
}

export interface LessonResource {
  id: string;
  title: string;
  provider: ResourceProvider;
  url: string;
}

export interface Module {
  id: string;
  title: string;
  sortOrder: number;
  lessons: Lesson[];
}

// ========== Evaluation Types ==========

export type EvaluationItemType = "tarea" | "examen" | "participacion" | "proyecto";

export interface EvaluationItem {
  id: string;
  type: EvaluationItemType;
  title: string;
  description: string;
  weight: number;
  dueDate?: string;
}

export interface EvaluationPlan {
  id: string;
  periodId: string;
  periodName: string;
  items: EvaluationItem[];
  totalWeight: number;
}

// ========== Submissions ==========

export interface Submission {
  id: string;
  evaluationItemId: string;
  studentId: string;
  studentName: string;
  courseSectionId: string;
  linkUrl: string;
  linkProvider: ResourceProvider;
  comment: string;
  submittedAt: string;
  grade?: number;
  gradedAt?: string;
  feedback?: string;
}

// ========== Grades (Cohorte) ==========

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  courseSectionId: string;
  periodId: string;
  evaluationItemId: string;
  evaluationItemTitle: string;
  score: number; // 0-100
  maxScore: number;
  weight: number;
}

export interface StudentPeriodGrade {
  studentId: string;
  studentName: string;
  periodId: string;
  periodName: string;
  grades: Grade[];
  weightedAverage: number;
}

// ========== Live Sessions ==========

export type LivePlatform = "zoom" | "meet" | "jitsi";

export interface LiveSession {
  id: string;
  courseSectionId: string;
  title: string;
  platform: LivePlatform;
  meetingUrl: string;
  scheduledAt: string;
  durationMinutes: number;
  status: "scheduled" | "live" | "completed" | "cancelled";
  teacherId: string;
  teacherName: string;
  courseName: string;
}

export interface Attendance {
  id: string;
  liveSessionId: string;
  studentId: string;
  studentName: string;
  confirmedAt?: string;
  joinedAt?: string;
  status: "pending" | "confirmed" | "attended" | "absent";
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

export const ROLE_LABELS: Record<UserRole, string> = {
  superadmin: "Super Administrador",
  admin: "Administrador",
  coordinator: "Coordinador",
  teacher: "Profesor",
  student: "Estudiante",
};

export const RESOURCE_PROVIDER_LABELS: Record<ResourceProvider, string> = {
  youtube: "YouTube",
  vimeo: "Vimeo",
  drive: "Google Drive",
  mega: "MEGA",
  mediafire: "MediaFire",
  external: "Enlace externo",
  none: "Ninguno",
};

export const LIVE_PLATFORM_LABELS: Record<LivePlatform, string> = {
  zoom: "Zoom",
  meet: "Google Meet",
  jitsi: "Jitsi Meet",
};

// ========== Course backward compat ==========

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
