import { motion } from "framer-motion";
import type { MessageResponse } from "@shared/routes";
import { cn } from "@/lib/utils";

interface MessageCardProps {
  message: MessageResponse;
  index: number;
}

// Map database colors to actual CSS classes/styles
// We use a mapping to ensure safe consistent styling
const COLOR_MAP: Record<string, { bg: string, text: string }> = {
  "#ef4444": { bg: "bg-red-500", text: "text-white" },       // Angry
  "#3b82f6": { bg: "bg-blue-500", text: "text-white" },      // Sad
  "#10b981": { bg: "bg-emerald-500", text: "text-white" },   // Peaceful
  "#f59e0b": { bg: "bg-amber-500", text: "text-white" },     // Nostalgic
  "#8b5cf6": { bg: "bg-violet-500", text: "text-white" },    // Love
  "#18181b": { bg: "bg-zinc-900", text: "text-zinc-100" },   // Empty
};

export function MessageCard({ message, index }: MessageCardProps) {
  // Default to black/white if color not found
  const theme = COLOR_MAP[message.color] || { bg: "bg-white", text: "text-black border border-zinc-200" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        "relative p-8 rounded-none aspect-square flex flex-col justify-between overflow-hidden group transition-all duration-500 hover:scale-[1.02]",
        theme.bg,
        theme.text
      )}
    >
      <div className="relative z-10">
        <h3 className="font-display text-2xl font-bold italic opacity-90 mb-4">
          To: {message.toName}
        </h3>
        <p className="font-sans text-lg leading-relaxed font-medium line-clamp-6 opacity-95">
          {message.content}
        </p>
      </div>

      {/* Subtle grain/noise overlay for texture on each card */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay pointer-events-none" />
      
      {/* Date at bottom */}
      <div className="relative z-10 mt-4 opacity-60 text-xs font-mono uppercase tracking-widest">
        {new Date(message.createdAt || Date.now()).toLocaleDateString(undefined, {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })}
      </div>
    </motion.div>
  );
}
