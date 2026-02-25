import DashboardLayout from "@/components/DashboardLayout";
import { MessageSquare, ThumbsUp, Clock, User } from "lucide-react";
import { motion } from "framer-motion";

const mockDiscussions = [
  { id: 1, title: "¿Cómo optimizar queries en MySQL?", course: "Desarrollo Web Full Stack", author: "Diego Salazar", replies: 12, likes: 8, time: "Hace 2 horas", solved: true },
  { id: 2, title: "Diferencia entre Flexbox y Grid", course: "Diseño UX/UI Avanzado", author: "Laura Vega", replies: 7, likes: 15, time: "Hace 5 horas", solved: false },
  { id: 3, title: "Error al implementar backpropagation", course: "Machine Learning Básico", author: "Ana Martínez", replies: 4, likes: 3, time: "Hace 1 día", solved: false },
  { id: 4, title: "Mejores prácticas de email marketing", course: "Marketing Digital", author: "Sofía Hernández", replies: 18, likes: 22, time: "Hace 1 día", solved: true },
  { id: 5, title: "¿Qué framework de testing usar?", course: "Desarrollo Web Full Stack", author: "Carlos Ruiz", replies: 9, likes: 6, time: "Hace 2 días", solved: true },
  { id: 6, title: "Recursos para practicar speaking", course: "Inglés para Negocios", author: "Valentina López", replies: 14, likes: 20, time: "Hace 3 días", solved: false },
];

const Community = () => {
  return (
    <DashboardLayout title="Comunidad">
      <div className="space-y-3">
        {mockDiscussions.map((discussion, i) => (
          <motion.div
            key={discussion.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass-card rounded-xl p-5 hover:border-primary/20 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
                {discussion.author.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-semibold text-foreground text-sm">{discussion.title}</h3>
                  {discussion.solved && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Resuelto</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{discussion.course}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {discussion.author}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {discussion.replies}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {discussion.likes}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {discussion.time}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Community;
