import { motion } from "framer-motion";
import type { MessageResponse } from "@shared/routes";
import { cn } from "@/lib/utils";

import pinkIcon from "@assets/stock_images/cute_cinnamoroll_san_a3e67eba.jpg";
import blueIcon from "@assets/stock_images/cute_cinnamoroll_san_789a7931.jpg";
import greenIcon from "@assets/stock_images/cute_cinnamoroll_san_1632d6e9.jpg";
import yellowIcon from "@assets/stock_images/cute_cinnamoroll_san_e6dee928.jpg";
import purpleIcon from "@assets/stock_images/cute_cinnamoroll_san_375291ea.jpg";
import whiteIcon from "@assets/stock_images/cute_cinnamoroll_san_fe959763.jpg";

interface MessageCardProps {
  message: MessageResponse;
  index: number;
}

// Map database colors to actual CSS classes/styles and icons
const COLOR_MAP: Record<string, { bg: string, text: string, icon: string }> = {
  "#ef4444": { bg: "bg-[#FFB7B2]", text: "text-[#4A4A4A]", icon: pinkIcon },
  "#3b82f6": { bg: "bg-[#B2E2F2]", text: "text-[#4A4A4A]", icon: blueIcon },
  "#10b981": { bg: "bg-[#B2F2BB]", text: "text-[#4A4A4A]", icon: greenIcon },
  "#f59e0b": { bg: "bg-[#FDFD96]", text: "text-[#4A4A4A]", icon: yellowIcon },
  "#8b5cf6": { bg: "bg-[#D1B2F2]", text: "text-[#4A4A4A]", icon: purpleIcon },
  "#18181b": { bg: "bg-[#FFFFFF]", text: "text-[#4A4A4A]", icon: whiteIcon },
};

export function MessageCard({ message, index }: MessageCardProps) {
  // Default to white if color not found
  const theme = COLOR_MAP[message.color] || { bg: "bg-white", text: "text-[#4A4A4A]", icon: whiteIcon };
  
  // Cycle through different paint splash shapes based on index
  const splatClass = `paint-splat-${(index % 4) + 1}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={cn(
        "relative p-8 flex flex-col justify-between overflow-hidden group transition-all duration-500 neon-glow cursor-pointer h-full min-h-[300px]",
        splatClass,
        theme.bg,
        theme.text
      )}
    >
      <div className="relative z-10 pr-16">
        <h3 className="font-display text-2xl font-bold tracking-tight text-primary-foreground mb-4">
          To: {message.toName}
        </h3>
        <p className="font-sans text-lg leading-relaxed font-medium line-clamp-6 opacity-90">
          {message.content}
        </p>
      </div>

      <img 
        src={theme.icon} 
        alt="" 
        className="absolute bottom-4 right-4 w-20 h-20 object-contain opacity-40 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none rounded-full"
      />

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
