import { useState } from "react";
import { useMessages } from "@/hooks/use-messages";
import { MessageCard } from "@/components/MessageCard";
import { Header } from "@/components/Header";
import { ComposeModal } from "@/components/ComposeModal";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [search, setSearch] = useState("");
  const { data: messages, isLoading, error } = useMessages(search);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Texture overlay */}
      <div className="bg-texture" />

      <Header onSearch={setSearch} />

      {/* Spacing for fixed header */}
      <div className="h-32 md:h-40" />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground animate-pulse">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p className="font-display text-xl">Retrieving memories...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-destructive">
            <p className="font-display text-2xl">Something went wrong.</p>
            <p className="font-sans mt-2 opacity-70">Please try refreshing the page.</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0.5 bg-border border border-border overflow-hidden">
              {messages?.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-32 text-center bg-background"
                >
                  <p className="font-display text-3xl text-muted-foreground">No messages found.</p>
                  <p className="mt-4 text-muted-foreground/60">Be the first to speak into the silence.</p>
                </motion.div>
              ) : (
                messages?.map((message, index) => (
                  <MessageCard key={message.id} message={message} index={index} />
                ))
              )}
            </div>
          </AnimatePresence>
        )}
      </main>

      <ComposeModal />
    </div>
  );
}
