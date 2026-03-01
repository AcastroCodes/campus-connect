import {
  Institution, Career, Subject, CourseSection, UserProfile, Enrollment,
  Submission, Grade, LiveSession, Attendance, EvaluationPlan, Module,
  InstitutionConfig, AcademicPeriod, Lesson, Curriculum, CurriculumEntry,
  BaseEvaluationPlan,
} from "@/types/dcampus";

const gid = () => Math.random().toString(36).substr(2, 9);

// ========== Institution Configs ==========

const trimesterConfig: InstitutionConfig = {
  periodType: "trimestre", periodsCount: 3,
  periods: [
    { id: "p1", name: "Trimestre 1", order: 1, startDate: "2026-01-15", endDate: "2026-04-15" },
    { id: "p2", name: "Trimestre 2", order: 2, startDate: "2026-04-20", endDate: "2026-07-20" },
    { id: "p3", name: "Trimestre 3", order: 3, startDate: "2026-07-25", endDate: "2026-10-25" },
  ],
};

const semesterConfig: InstitutionConfig = {
  periodType: "semestre", periodsCount: 2,
  periods: [
    { id: "s1", name: "Semestre 1", order: 1, startDate: "2026-01-15", endDate: "2026-06-15" },
    { id: "s2", name: "Semestre 2", order: 2, startDate: "2026-07-01", endDate: "2026-12-15" },
  ],
};

// ========== Institutions ==========

export const mockInstitutions: Institution[] = [
  {
    id: "inst1", name: "Universidad del Norte", subdomain: "uninorte", isActive: true,
    primaryColor: "#2E9B63", adminId: "u1", adminName: "Dr. Mónica García",
    config: trimesterConfig, createdAt: "2025-06-01",
  },
  {
    id: "inst2", name: "Instituto Tecnológico Avanzado", subdomain: "ita", isActive: true,
    primaryColor: "#3B82F6", adminId: "u4", adminName: "Lic. Roberto Díaz",
    config: semesterConfig, createdAt: "2025-08-15",
  },
  {
    id: "inst3", name: "Escuela de Negocios Global", subdomain: "eng", isActive: true,
    primaryColor: "#8B5CF6", adminId: "u7", adminName: "Dra. Patricia Suárez",
    config: trimesterConfig, createdAt: "2025-09-01",
  },
  {
    id: "inst4", name: "Academia de Arte Digital", subdomain: "artedigital", isActive: false,
    primaryColor: "#F59E0B", adminId: "u8", adminName: "Prof. Ernesto Villa",
    config: { periodType: "bimestre", periodsCount: 5, periods: Array.from({ length: 5 }, (_, i) => ({ id: `b${i + 1}`, name: `Bimestre ${i + 1}`, order: i + 1 })) },
    createdAt: "2025-10-01",
  },
];

// ========== Careers ==========

export const mockCareers: Career[] = [
  { id: "car1", institutionId: "inst1", name: "Ingeniería en Sistemas", code: "ISC", description: "Formación integral en desarrollo de software y sistemas computacionales.", isActive: true, subjectsCount: 8, studentsCount: 120 },
  { id: "car2", institutionId: "inst1", name: "Diseño Gráfico Digital", code: "DGD", description: "Diseño visual, multimedia y experiencia de usuario.", isActive: true, subjectsCount: 6, studentsCount: 85 },
  { id: "car3", institutionId: "inst1", name: "Administración de Empresas", code: "ADE", description: "Gestión empresarial, finanzas y liderazgo.", isActive: true, subjectsCount: 7, studentsCount: 95 },
  { id: "car4", institutionId: "inst2", name: "Ciencia de Datos", code: "CD", description: "Análisis de datos, machine learning e inteligencia artificial.", isActive: true, subjectsCount: 5, studentsCount: 60 },
  { id: "car5", institutionId: "inst2", name: "Ciberseguridad", code: "CS", description: "Seguridad informática y protección de sistemas.", isActive: true, subjectsCount: 6, studentsCount: 45 },
];

// ========== Subjects ==========

export const mockSubjects: Subject[] = [
  { id: "sub1", careerId: "car1", institutionId: "inst1", name: "Desarrollo Web Full Stack", code: "ISC-401", credits: 4, semester: 4, isActive: true },
  { id: "sub2", careerId: "car1", institutionId: "inst1", name: "Bases de Datos Avanzadas", code: "ISC-402", credits: 3, semester: 4, isActive: true },
  { id: "sub3", careerId: "car1", institutionId: "inst1", name: "Arquitectura de Software", code: "ISC-501", credits: 4, semester: 5, isActive: true },
  { id: "sub4", careerId: "car1", institutionId: "inst1", name: "Inteligencia Artificial", code: "ISC-502", credits: 3, semester: 5, isActive: true },
  { id: "sub5", careerId: "car2", institutionId: "inst1", name: "Diseño UX/UI Avanzado", code: "DGD-301", credits: 4, semester: 3, isActive: true },
  { id: "sub6", careerId: "car2", institutionId: "inst1", name: "Motion Graphics", code: "DGD-302", credits: 3, semester: 3, isActive: true },
  { id: "sub7", careerId: "car4", institutionId: "inst2", name: "Machine Learning", code: "CD-201", credits: 4, semester: 2, isActive: true },
  { id: "sub8", careerId: "car4", institutionId: "inst2", name: "Visualización de Datos", code: "CD-202", credits: 3, semester: 2, isActive: true },
];

// ========== Curriculum (Pensum) ==========

export const mockCurriculums: Curriculum[] = [
  {
    id: "cur1", careerId: "car1", institutionId: "inst1", name: "Pensum 2026", year: 2026, isActive: true,
    entries: [
      { id: "ce1", careerId: "car1", subjectId: "sub1", semester: 4, isRequired: true, prerequisites: [] },
      { id: "ce2", careerId: "car1", subjectId: "sub2", semester: 4, isRequired: true, prerequisites: [] },
      { id: "ce3", careerId: "car1", subjectId: "sub3", semester: 5, isRequired: true, prerequisites: ["sub1"] },
      { id: "ce4", careerId: "car1", subjectId: "sub4", semester: 5, isRequired: false, prerequisites: ["sub2"] },
    ],
  },
  {
    id: "cur2", careerId: "car2", institutionId: "inst1", name: "Pensum 2026", year: 2026, isActive: true,
    entries: [
      { id: "ce5", careerId: "car2", subjectId: "sub5", semester: 3, isRequired: true, prerequisites: [] },
      { id: "ce6", careerId: "car2", subjectId: "sub6", semester: 3, isRequired: true, prerequisites: [] },
    ],
  },
  {
    id: "cur3", careerId: "car4", institutionId: "inst2", name: "Pensum 2026", year: 2026, isActive: true,
    entries: [
      { id: "ce7", careerId: "car4", subjectId: "sub7", semester: 2, isRequired: true, prerequisites: [] },
      { id: "ce8", careerId: "car4", subjectId: "sub8", semester: 2, isRequired: true, prerequisites: [] },
    ],
  },
];

// ========== Base Evaluation Plans ==========

export const mockBaseEvaluationPlans: BaseEvaluationPlan[] = [
  {
    id: "bep1", subjectId: "sub1", institutionId: "inst1", name: "Plan Base - Desarrollo Web",
    totalWeight: 100, createdBy: "u0",
    items: [
      { id: "bei1", type: "tarea", title: "Tareas Prácticas", description: "Entregas de código funcional", weight: 25 },
      { id: "bei2", type: "examen", title: "Exámenes Parciales", description: "Evaluación teórica-práctica", weight: 35 },
      { id: "bei3", type: "participacion", title: "Participación", description: "Asistencia y participación activa", weight: 10 },
      { id: "bei4", type: "proyecto", title: "Proyecto Final", description: "Aplicación funcional completa", weight: 30 },
    ],
  },
  {
    id: "bep2", subjectId: "sub5", institutionId: "inst1", name: "Plan Base - UX/UI",
    totalWeight: 100, createdBy: "u0",
    items: [
      { id: "bei5", type: "tarea", title: "Wireframes y Prototipos", description: "Entregas de diseño", weight: 30 },
      { id: "bei6", type: "examen", title: "Evaluación Teórica", description: "Principios de diseño", weight: 20 },
      { id: "bei7", type: "participacion", title: "Participación", description: "Críticas de diseño en clase", weight: 15 },
      { id: "bei8", type: "proyecto", title: "Proyecto Rediseño App", description: "Case study completo", weight: 35 },
    ],
  },
];

// ========== Users ==========

export const mockUsers: UserProfile[] = [
  { id: "u0", name: "Super Admin", email: "super@dcampus.com", institutionId: "", role: "superadmin", isActive: true },
  { id: "u1", name: "Dr. Mónica García", email: "admin@dcampus.com", institutionId: "inst1", role: "admin", isActive: true },
  { id: "u2", name: "Prof. Carlos López", email: "teacher@dcampus.com", institutionId: "inst1", role: "teacher", isActive: true, bio: "Ingeniero de software con 10 años de experiencia en desarrollo web." },
  { id: "u3", name: "Ana Martínez", email: "student@dcampus.com", institutionId: "inst1", role: "student", isActive: true },
  { id: "u4", name: "Lic. Roberto Díaz", email: "admin2@dcampus.com", institutionId: "inst2", role: "admin", isActive: true },
  { id: "u5", name: "Dra. Ana Ríos", email: "arios@dcampus.com", institutionId: "inst1", role: "teacher", isActive: true, bio: "Doctora en diseño de interacción y UX research." },
  { id: "u6", name: "Coord. Laura Vega", email: "coord@dcampus.com", institutionId: "inst1", role: "coordinator", isActive: true },
  { id: "u7", name: "Dra. Patricia Suárez", email: "psuarez@dcampus.com", institutionId: "inst3", role: "admin", isActive: true },
  { id: "u8", name: "Prof. Ernesto Villa", email: "evilla@dcampus.com", institutionId: "inst4", role: "admin", isActive: true },
  // Students
  { id: "s1", name: "Diego Salazar", email: "diego@correo.com", institutionId: "inst1", role: "student", isActive: true },
  { id: "s2", name: "Laura Vega Peña", email: "laurav@correo.com", institutionId: "inst1", role: "student", isActive: true },
  { id: "s3", name: "Miguel Ángel Torres", email: "miguel@correo.com", institutionId: "inst1", role: "student", isActive: false },
  { id: "s4", name: "Sofía Hernández", email: "sofia@correo.com", institutionId: "inst1", role: "student", isActive: true },
  { id: "s5", name: "Carlos Ruiz", email: "carlos@correo.com", institutionId: "inst1", role: "student", isActive: true },
  { id: "s6", name: "Valentina López", email: "vale@correo.com", institutionId: "inst1", role: "student", isActive: true },
  { id: "s7", name: "Andrés Moreno", email: "andres@correo.com", institutionId: "inst1", role: "student", isActive: false },
];

// ========== Course Sections ==========

const createEvalPlans = (periods: AcademicPeriod[]): EvaluationPlan[] =>
  periods.map((p) => ({ id: gid(), periodId: p.id, periodName: p.name, items: [], totalWeight: 0 }));

const sampleModules: Module[] = [
  {
    id: "m1", title: "Fundamentos HTML/CSS", sortOrder: 1,
    lessons: [
      { id: "l1", title: "Introducción a HTML5", contentText: "Contenido de la lección...", videoProvider: "youtube", videoId: "dQw4w9WgXcQ", isFree: true, sortOrder: 1, resources: [] },
      { id: "l2", title: "CSS Flexbox y Grid", contentText: "Aprende layout moderno...", videoProvider: "youtube", videoId: "abc123", isFree: false, sortOrder: 2, resources: [{ id: "r1", title: "Slides de clase", provider: "drive", url: "https://drive.google.com/file/d/example" }] },
    ],
  },
  {
    id: "m2", title: "JavaScript Moderno", sortOrder: 2,
    lessons: [
      { id: "l3", title: "ES6+ Features", contentText: "Arrow functions, destructuring...", videoProvider: "vimeo", videoId: "123456", isFree: false, sortOrder: 1, resources: [] },
    ],
  },
];

const sampleEvalPlans: EvaluationPlan[] = [
  {
    id: "ep1", periodId: "p1", periodName: "Trimestre 1", totalWeight: 100,
    items: [
      { id: "ei1", type: "tarea", title: "Maquetación HTML", description: "Crear una página web estática", weight: 20, dueDate: "2026-02-15" },
      { id: "ei2", type: "examen", title: "Examen Parcial 1", description: "HTML, CSS y diseño responsive", weight: 40, dueDate: "2026-03-01" },
      { id: "ei3", type: "participacion", title: "Participación en clase", description: "Asistencia y participación activa", weight: 15 },
      { id: "ei4", type: "proyecto", title: "Proyecto Landing Page", description: "Crear una landing page profesional", weight: 25, dueDate: "2026-03-15" },
    ],
  },
  {
    id: "ep2", periodId: "p2", periodName: "Trimestre 2", totalWeight: 100,
    items: [
      { id: "ei5", type: "tarea", title: "API REST con Node.js", description: "Crear un CRUD básico", weight: 25, dueDate: "2026-05-01" },
      { id: "ei6", type: "examen", title: "Examen Parcial 2", description: "JavaScript y Node.js", weight: 35, dueDate: "2026-05-15" },
      { id: "ei7", type: "participacion", title: "Participación", description: "Participación activa", weight: 10 },
      { id: "ei8", type: "proyecto", title: "Proyecto Full Stack", description: "Aplicación completa", weight: 30, dueDate: "2026-06-01" },
    ],
  },
  { id: "ep3", periodId: "p3", periodName: "Trimestre 3", totalWeight: 0, items: [] },
];

export const mockCourseSections: CourseSection[] = [
  {
    id: "cs1", subjectId: "sub1", institutionId: "inst1", periodId: "p1", periodName: "Trimestre 1",
    teacherId: "u2", teacherName: "Prof. Carlos López", accentColor: "#2E9B63",
    welcomeMessage: "Bienvenido al curso de Desarrollo Web Full Stack",
    status: "active", modules: sampleModules, evaluationPlans: sampleEvalPlans,
    enrollmentsCount: 45, year: 2026, baseEvaluationPlanId: "bep1",
  },
  {
    id: "cs2", subjectId: "sub5", institutionId: "inst1", periodId: "p1", periodName: "Trimestre 1",
    teacherId: "u5", teacherName: "Dra. Ana Ríos", accentColor: "#3B82F6",
    welcomeMessage: "", status: "active", modules: [{ id: "m3", title: "Principios de UX", sortOrder: 1, lessons: [{ id: "l4", title: "Investigación de usuarios", contentText: "", videoProvider: "none", videoId: "", isFree: true, sortOrder: 1, resources: [] }] }],
    evaluationPlans: createEvalPlans(trimesterConfig.periods), enrollmentsCount: 32, year: 2026, baseEvaluationPlanId: "bep2",
  },
  {
    id: "cs3", subjectId: "sub7", institutionId: "inst2", periodId: "s1", periodName: "Semestre 1",
    teacherId: "u2", teacherName: "Dr. Luis Mendez", accentColor: "#F59E0B",
    welcomeMessage: "", status: "draft", modules: [],
    evaluationPlans: createEvalPlans(semesterConfig.periods), enrollmentsCount: 28, year: 2026,
  },
];

// ========== Enrollments ==========

export const mockEnrollments: Enrollment[] = [
  { id: "en1", studentId: "u3", studentName: "Ana Martínez", studentEmail: "student@dcampus.com", courseSectionId: "cs1", enrolledAt: "2026-01-15", status: "active" },
  { id: "en2", studentId: "s1", studentName: "Diego Salazar", studentEmail: "diego@correo.com", courseSectionId: "cs1", enrolledAt: "2026-01-16", status: "active" },
  { id: "en3", studentId: "s2", studentName: "Laura Vega Peña", studentEmail: "laurav@correo.com", courseSectionId: "cs1", enrolledAt: "2026-01-15", status: "active" },
  { id: "en4", studentId: "s4", studentName: "Sofía Hernández", studentEmail: "sofia@correo.com", courseSectionId: "cs1", enrolledAt: "2026-01-18", status: "active" },
  { id: "en5", studentId: "s5", studentName: "Carlos Ruiz", studentEmail: "carlos@correo.com", courseSectionId: "cs1", enrolledAt: "2026-02-01", status: "active" },
  { id: "en6", studentId: "s6", studentName: "Valentina López", studentEmail: "vale@correo.com", courseSectionId: "cs2", enrolledAt: "2026-01-20", status: "active" },
  { id: "en7", studentId: "s3", studentName: "Miguel Ángel Torres", studentEmail: "miguel@correo.com", courseSectionId: "cs1", enrolledAt: "2026-01-28", status: "dropped" },
];

// ========== Submissions ==========

export const mockSubmissions: Submission[] = [
  { id: "sub1", evaluationItemId: "ei1", studentId: "u3", studentName: "Ana Martínez", courseSectionId: "cs1", linkUrl: "https://drive.google.com/file/d/ana-tarea1", linkProvider: "drive", comment: "Aquí está mi entrega", submittedAt: "2026-02-14T10:30:00", grade: 92, gradedAt: "2026-02-16T14:00:00", feedback: "Excelente trabajo" },
  { id: "sub2", evaluationItemId: "ei1", studentId: "s1", studentName: "Diego Salazar", courseSectionId: "cs1", linkUrl: "https://mega.nz/file/diego-tarea1", linkProvider: "mega", comment: "Mi proyecto", submittedAt: "2026-02-15T08:00:00", grade: 78, gradedAt: "2026-02-16T15:00:00", feedback: "Bien, pero faltó responsive" },
  { id: "sub3", evaluationItemId: "ei1", studentId: "s2", studentName: "Laura Vega Peña", courseSectionId: "cs1", linkUrl: "https://drive.google.com/file/d/laura-tarea1", linkProvider: "drive", comment: "", submittedAt: "2026-02-15T23:50:00" },
  { id: "sub4", evaluationItemId: "ei4", studentId: "u3", studentName: "Ana Martínez", courseSectionId: "cs1", linkUrl: "https://github.com/ana/landing-page", linkProvider: "external", comment: "Proyecto desplegado en Vercel", submittedAt: "2026-03-14T16:00:00", grade: 95, gradedAt: "2026-03-16T10:00:00", feedback: "Excelente UI/UX" },
];

// ========== Grades ==========

export const mockGrades: Grade[] = [
  { id: "g1", studentId: "u3", studentName: "Ana Martínez", courseSectionId: "cs1", periodId: "p1", evaluationItemId: "ei1", evaluationItemTitle: "Maquetación HTML", score: 92, maxScore: 100, weight: 20 },
  { id: "g2", studentId: "u3", studentName: "Ana Martínez", courseSectionId: "cs1", periodId: "p1", evaluationItemId: "ei2", evaluationItemTitle: "Examen Parcial 1", score: 88, maxScore: 100, weight: 40 },
  { id: "g3", studentId: "u3", studentName: "Ana Martínez", courseSectionId: "cs1", periodId: "p1", evaluationItemId: "ei3", evaluationItemTitle: "Participación en clase", score: 95, maxScore: 100, weight: 15 },
  { id: "g4", studentId: "u3", studentName: "Ana Martínez", courseSectionId: "cs1", periodId: "p1", evaluationItemId: "ei4", evaluationItemTitle: "Proyecto Landing Page", score: 95, maxScore: 100, weight: 25 },
  { id: "g5", studentId: "s1", studentName: "Diego Salazar", courseSectionId: "cs1", periodId: "p1", evaluationItemId: "ei1", evaluationItemTitle: "Maquetación HTML", score: 78, maxScore: 100, weight: 20 },
  { id: "g6", studentId: "s1", studentName: "Diego Salazar", courseSectionId: "cs1", periodId: "p1", evaluationItemId: "ei2", evaluationItemTitle: "Examen Parcial 1", score: 65, maxScore: 100, weight: 40 },
  { id: "g7", studentId: "s2", studentName: "Laura Vega Peña", courseSectionId: "cs1", periodId: "p1", evaluationItemId: "ei1", evaluationItemTitle: "Maquetación HTML", score: 85, maxScore: 100, weight: 20 },
  { id: "g8", studentId: "s4", studentName: "Sofía Hernández", courseSectionId: "cs1", periodId: "p1", evaluationItemId: "ei1", evaluationItemTitle: "Maquetación HTML", score: 90, maxScore: 100, weight: 20 },
  { id: "g9", studentId: "s4", studentName: "Sofía Hernández", courseSectionId: "cs1", periodId: "p1", evaluationItemId: "ei2", evaluationItemTitle: "Examen Parcial 1", score: 92, maxScore: 100, weight: 40 },
];

// ========== Live Sessions ==========

export const mockLiveSessions: LiveSession[] = [
  { id: "ls1", courseSectionId: "cs1", title: "Introducción a React Hooks", platform: "zoom", meetingUrl: "https://zoom.us/j/123456", scheduledAt: "2026-02-28T10:00:00", durationMinutes: 90, status: "live", teacherId: "u2", teacherName: "Prof. Carlos López", courseName: "Desarrollo Web Full Stack" },
  { id: "ls2", courseSectionId: "cs2", title: "Principios de Diseño Visual", platform: "meet", meetingUrl: "https://meet.google.com/abc-def", scheduledAt: "2026-02-28T14:00:00", durationMinutes: 90, status: "scheduled", teacherId: "u5", teacherName: "Dra. Ana Ríos", courseName: "Diseño UX/UI Avanzado" },
  { id: "ls3", courseSectionId: "cs1", title: "Node.js y Express", platform: "zoom", meetingUrl: "https://zoom.us/j/789012", scheduledAt: "2026-03-01T09:00:00", durationMinutes: 90, status: "scheduled", teacherId: "u2", teacherName: "Prof. Carlos López", courseName: "Desarrollo Web Full Stack" },
  { id: "ls4", courseSectionId: "cs1", title: "Bases de Datos NoSQL", platform: "jitsi", meetingUrl: "https://meet.jit.si/dcampus-nosql", scheduledAt: "2026-03-02T11:00:00", durationMinutes: 60, status: "scheduled", teacherId: "u2", teacherName: "Prof. Carlos López", courseName: "Desarrollo Web Full Stack" },
];

export const mockAttendance: Attendance[] = [
  { id: "a1", liveSessionId: "ls1", studentId: "u3", studentName: "Ana Martínez", confirmedAt: "2026-02-27T20:00:00", joinedAt: "2026-02-28T09:58:00", status: "attended" },
  { id: "a2", liveSessionId: "ls1", studentId: "s1", studentName: "Diego Salazar", confirmedAt: "2026-02-28T08:00:00", status: "confirmed" },
  { id: "a3", liveSessionId: "ls1", studentId: "s2", studentName: "Laura Vega Peña", status: "pending" },
  { id: "a4", liveSessionId: "ls1", studentId: "s4", studentName: "Sofía Hernández", confirmedAt: "2026-02-27T18:00:00", joinedAt: "2026-02-28T10:02:00", status: "attended" },
  { id: "a5", liveSessionId: "ls1", studentId: "s5", studentName: "Carlos Ruiz", status: "absent" },
];

// ========== Helpers ==========

export { trimesterConfig as institutionConfig };

export const createEmptyEvaluationPlans = (periods: AcademicPeriod[]): EvaluationPlan[] =>
  periods.map((p) => ({ id: gid(), periodId: p.id, periodName: p.name, items: [], totalWeight: 0 }));

export const getInstitutionStats = (instId: string) => {
  const careers = mockCareers.filter((c) => c.institutionId === instId);
  const subjects = mockSubjects.filter((s) => s.institutionId === instId);
  const sections = mockCourseSections.filter((c) => c.institutionId === instId);
  const students = mockUsers.filter((u) => u.institutionId === instId && u.role === "student");
  const teachers = mockUsers.filter((u) => u.institutionId === instId && u.role === "teacher");
  const totalEnrollments = mockEnrollments.filter((e) => sections.some((s) => s.id === e.courseSectionId)).length;
  const totalSubmissions = mockSubmissions.filter((s) => sections.some((cs) => cs.id === s.courseSectionId)).length;
  const gradedSubmissions = mockSubmissions.filter((s) => sections.some((cs) => cs.id === s.courseSectionId) && s.grade !== undefined).length;

  return {
    careersCount: careers.length,
    subjectsCount: subjects.length,
    sectionsCount: sections.length,
    studentsCount: students.length,
    teachersCount: teachers.length,
    enrollmentsCount: totalEnrollments,
    submissionsCount: totalSubmissions,
    submissionRate: totalSubmissions > 0 ? Math.round((gradedSubmissions / totalSubmissions) * 100) : 0,
  };
};
