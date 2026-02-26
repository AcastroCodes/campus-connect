import { Course, InstitutionConfig, AcademicPeriod, EvaluationPlan } from "@/types/dcampus";

// Default institution config
export const institutionConfig: InstitutionConfig = {
  periodType: "trimestre",
  periodsCount: 3,
  periods: [
    { id: "p1", name: "Trimestre 1", order: 1 },
    { id: "p2", name: "Trimestre 2", order: 2 },
    { id: "p3", name: "Trimestre 3", order: 3 },
  ],
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const createEmptyEvaluationPlans = (periods: AcademicPeriod[]): EvaluationPlan[] =>
  periods.map((p) => ({
    id: generateId(),
    periodId: p.id,
    periodName: p.name,
    items: [],
    totalWeight: 0,
  }));

export const mockCourses: Course[] = [
  {
    id: "c1",
    title: "Desarrollo Web Full Stack",
    slug: "desarrollo-web-full-stack",
    description: "Aprende a construir aplicaciones web completas con tecnologías modernas.",
    coverImage: "",
    accentColor: "#2E9B63",
    welcomeMessage: "<p>Bienvenido al curso de Desarrollo Web Full Stack</p>",
    teacherId: "t1",
    teacherName: "Prof. Carlos López",
    status: "active",
    studentsCount: 45,
    createdAt: "2025-01-15",
    modules: [
      {
        id: "m1", title: "Fundamentos HTML/CSS", sortOrder: 1,
        lessons: [
          { id: "l1", title: "Introducción a HTML5", contentText: "Contenido de la lección...", videoProvider: "youtube", videoId: "dQw4w9WgXcQ", isFree: true, sortOrder: 1 },
          { id: "l2", title: "CSS Flexbox y Grid", contentText: "Aprende layout moderno...", videoProvider: "youtube", videoId: "abc123", isFree: false, sortOrder: 2 },
        ],
      },
      {
        id: "m2", title: "JavaScript Moderno", sortOrder: 2,
        lessons: [
          { id: "l3", title: "ES6+ Features", contentText: "Arrow functions, destructuring...", videoProvider: "vimeo", videoId: "123456", isFree: false, sortOrder: 1 },
        ],
      },
    ],
    evaluationPlans: [
      {
        id: "ep1", periodId: "p1", periodName: "Trimestre 1", totalWeight: 100,
        items: [
          { id: "ei1", type: "tarea", title: "Maquetación HTML", description: "Crear una página web estática", weight: 20, dueDate: "2025-02-15" },
          { id: "ei2", type: "examen", title: "Examen Parcial 1", description: "HTML, CSS y diseño responsive", weight: 40, dueDate: "2025-03-01" },
          { id: "ei3", type: "participacion", title: "Participación en clase", description: "Asistencia y participación activa", weight: 15 },
          { id: "ei4", type: "proyecto", title: "Proyecto Landing Page", description: "Crear una landing page profesional", weight: 25, dueDate: "2025-03-15" },
        ],
      },
      {
        id: "ep2", periodId: "p2", periodName: "Trimestre 2", totalWeight: 100,
        items: [
          { id: "ei5", type: "tarea", title: "API REST con Node.js", description: "Crear un CRUD básico", weight: 25, dueDate: "2025-05-01" },
          { id: "ei6", type: "examen", title: "Examen Parcial 2", description: "JavaScript y Node.js", weight: 35, dueDate: "2025-05-15" },
          { id: "ei7", type: "participacion", title: "Participación", description: "Participación activa", weight: 10 },
          { id: "ei8", type: "proyecto", title: "Proyecto Full Stack", description: "Aplicación completa", weight: 30, dueDate: "2025-06-01" },
        ],
      },
      { id: "ep3", periodId: "p3", periodName: "Trimestre 3", totalWeight: 0, items: [] },
    ],
  },
  {
    id: "c2",
    title: "Diseño UX/UI Avanzado",
    slug: "diseno-ux-ui-avanzado",
    description: "Domina las técnicas avanzadas de diseño de experiencia de usuario.",
    coverImage: "",
    accentColor: "#3B82F6",
    welcomeMessage: "",
    teacherId: "t2",
    teacherName: "Dra. Ana Ríos",
    status: "active",
    studentsCount: 32,
    createdAt: "2025-02-01",
    modules: [
      {
        id: "m3", title: "Principios de UX", sortOrder: 1,
        lessons: [
          { id: "l4", title: "Investigación de usuarios", contentText: "", videoProvider: "none", videoId: "", isFree: true, sortOrder: 1 },
        ],
      },
    ],
    evaluationPlans: createEmptyEvaluationPlans(institutionConfig.periods),
  },
  {
    id: "c3",
    title: "Machine Learning Básico",
    slug: "machine-learning-basico",
    description: "Introducción al aprendizaje automático con Python.",
    coverImage: "",
    accentColor: "#F59E0B",
    welcomeMessage: "",
    teacherId: "t3",
    teacherName: "Dr. Luis Mendez",
    status: "draft",
    studentsCount: 28,
    createdAt: "2025-01-20",
    modules: [],
    evaluationPlans: createEmptyEvaluationPlans(institutionConfig.periods),
  },
];
