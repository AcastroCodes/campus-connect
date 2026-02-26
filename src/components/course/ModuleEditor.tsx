import { Module, Lesson } from "@/types/dcampus";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight, Video, Eye } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  modules: Module[];
  onChange: (modules: Module[]) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const ModuleEditor = ({ modules, onChange }: Props) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(modules.map((m) => m.id)));

  const toggleModule = (id: string) => {
    const next = new Set(expandedModules);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedModules(next);
  };

  const addModule = () => {
    const newModule: Module = {
      id: generateId(),
      title: "",
      sortOrder: modules.length + 1,
      lessons: [],
    };
    onChange([...modules, newModule]);
    setExpandedModules((prev) => new Set(prev).add(newModule.id));
  };

  const updateModule = (id: string, title: string) => {
    onChange(modules.map((m) => (m.id === id ? { ...m, title } : m)));
  };

  const removeModule = (id: string) => {
    onChange(modules.filter((m) => m.id !== id));
  };

  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: generateId(),
      title: "",
      contentText: "",
      videoProvider: "none",
      videoId: "",
      isFree: false,
      sortOrder: 0,
    };
    onChange(
      modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: [...m.lessons, { ...newLesson, sortOrder: m.lessons.length + 1 }] }
          : m
      )
    );
  };

  const updateLesson = (moduleId: string, lessonId: string, field: keyof Lesson, value: string | boolean) => {
    onChange(
      modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, [field]: value } : l)) }
          : m
      )
    );
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    onChange(
      modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m
      )
    );
  };

  const parseVideoUrl = (url: string): { provider: "youtube" | "vimeo" | "none"; id: string } => {
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return { provider: "youtube", id: ytMatch[1] };
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return { provider: "vimeo", id: vimeoMatch[1] };
    return { provider: "none", id: "" };
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {modules.map((mod, idx) => (
          <motion.div
            key={mod.id}
            layout
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="border border-border rounded-lg overflow-hidden"
          >
            {/* Module header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50">
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
              <button onClick={() => toggleModule(mod.id)} className="text-muted-foreground">
                {expandedModules.has(mod.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              <span className="text-xs font-medium text-muted-foreground w-8">M{idx + 1}</span>
              <input
                type="text"
                placeholder="Nombre del módulo..."
                value={mod.title}
                onChange={(e) => updateModule(mod.id, e.target.value)}
                className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <span className="text-xs text-muted-foreground">{mod.lessons.length} lecciones</span>
              <button onClick={() => removeModule(mod.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Lessons */}
            {expandedModules.has(mod.id) && (
              <div className="px-4 py-3 space-y-3">
                {mod.lessons.map((lesson, li) => (
                  <div key={lesson.id} className="pl-6 border-l-2 border-border space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-6">{li + 1}.</span>
                      <input
                        type="text"
                        placeholder="Título de la lección..."
                        value={lesson.title}
                        onChange={(e) => updateLesson(mod.id, lesson.id, "title", e.target.value)}
                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                      />
                      <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer">
                        <Eye className="w-3 h-3" />
                        <input
                          type="checkbox"
                          checked={lesson.isFree}
                          onChange={(e) => updateLesson(mod.id, lesson.id, "isFree", e.target.checked)}
                          className="w-3 h-3"
                        />
                        Gratis
                      </label>
                      <button onClick={() => removeLesson(mod.id, lesson.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <textarea
                      placeholder="Contenido de la lección..."
                      value={lesson.contentText}
                      onChange={(e) => updateLesson(mod.id, lesson.id, "contentText", e.target.value)}
                      rows={2}
                      className="w-full bg-muted/50 rounded-md px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
                    />
                    <div className="flex items-center gap-2">
                      <Video className="w-3.5 h-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="URL de YouTube o Vimeo (ej: youtube.com/watch?v=abc123)..."
                        value={
                          lesson.videoProvider === "youtube"
                            ? `https://youtube.com/watch?v=${lesson.videoId}`
                            : lesson.videoProvider === "vimeo"
                            ? `https://vimeo.com/${lesson.videoId}`
                            : ""
                        }
                        onChange={(e) => {
                          const { provider, id } = parseVideoUrl(e.target.value);
                          updateLesson(mod.id, lesson.id, "videoProvider", provider);
                          updateLesson(mod.id, lesson.id, "videoId", id);
                        }}
                        className="flex-1 bg-transparent text-xs text-muted-foreground placeholder:text-muted-foreground focus:outline-none"
                      />
                      {lesson.videoProvider !== "none" && (
                        <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary capitalize">
                          {lesson.videoProvider}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addLesson(mod.id)}
                  className="flex items-center gap-1.5 pl-6 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Plus className="w-3 h-3" /> Agregar lección
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        onClick={addModule}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
      >
        <Plus className="w-4 h-4" /> Agregar módulo
      </button>
    </div>
  );
};

export default ModuleEditor;
