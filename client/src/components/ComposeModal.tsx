import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, Send, Loader2 } from "lucide-react";
import { useCreateMessage } from "@/hooks/use-messages";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const EMOTIONS = [
  { color: "#ef4444", label: "Angry", class: "bg-red-500" },
  { color: "#3b82f6", label: "Sad", class: "bg-blue-500" },
  { color: "#10b981", label: "Peaceful", class: "bg-emerald-500" },
  { color: "#f59e0b", label: "Nostalgic", class: "bg-amber-500" },
  { color: "#8b5cf6", label: "In Love", class: "bg-violet-500" },
  { color: "#18181b", label: "Empty", class: "bg-zinc-900" },
];

export function ComposeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(EMOTIONS[5]); // Default to Empty (Black)
  const [toName, setToName] = useState("");
  const [content, setContent] = useState("");
  
  const createMessage = useCreateMessage();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toName.trim() || !content.trim()) return;

    try {
      await createMessage.mutateAsync({
        toName,
        content,
        color: selectedColor.color,
      });
      
      toast({
        title: "Sent into the void",
        description: "Your message has been released.",
      });
      
      setIsOpen(false);
      // Reset form
      setToName("");
      setContent("");
      setSelectedColor(EMOTIONS[5]);
    } catch (error) {
      toast({
        title: "Failed to send",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="fixed bottom-8 right-8 rounded-full h-16 w-16 shadow-2xl hover:scale-110 transition-transform duration-300 bg-black text-white hover:bg-zinc-800 z-40"
        >
          <PenLine className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(
        "p-0 gap-0 overflow-hidden border-none sm:max-w-xl transition-colors duration-500 h-[600px] flex flex-col",
        selectedColor.class
      )}>
        <form onSubmit={handleSubmit} className="flex flex-col h-full relative z-10">
          <div className="flex-1 p-8 flex flex-col justify-center gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="text-white/60 text-sm font-medium uppercase tracking-widest mb-2 block">
                  To Whom?
                </label>
                <Input
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  placeholder="Name..."
                  className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 text-4xl font-display text-white placeholder:text-white/20 focus-visible:ring-0 focus-visible:border-white h-auto py-2"
                  maxLength={50}
                  autoFocus
                />
              </div>

              <div>
                <label className="text-white/60 text-sm font-medium uppercase tracking-widest mb-2 block">
                  Your Message
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type your unsent message here..."
                  className="bg-transparent border-none resize-none px-0 text-xl font-sans text-white placeholder:text-white/20 focus-visible:ring-0 min-h-[200px]"
                  maxLength={500}
                />
              </div>
            </motion.div>
          </div>

          <div className="p-6 bg-black/20 backdrop-blur-sm border-t border-white/10 flex items-center justify-between">
            <div className="flex gap-2">
              {EMOTIONS.map((emotion) => (
                <button
                  key={emotion.color}
                  type="button"
                  onClick={() => setSelectedColor(emotion)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all duration-200",
                    emotion.class,
                    selectedColor.color === emotion.color 
                      ? "border-white scale-110" 
                      : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                  )}
                  title={emotion.label}
                />
              ))}
            </div>

            <Button 
              type="submit" 
              disabled={createMessage.isPending || !toName || !content}
              className="bg-white text-black hover:bg-white/90 rounded-full px-8 font-medium"
            >
              {createMessage.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {createMessage.isPending ? "Sending..." : "Release"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
