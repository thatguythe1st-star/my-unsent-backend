import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? "bg-background/90 backdrop-blur-md py-4 shadow-[0_0_20px_rgba(255,0,255,0.3)]" : "bg-transparent py-8"
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h1 className="font-display text-5xl font-black tracking-tighter text-primary transform -rotate-2 drop-shadow-[2px_2px_0px_#00ffff]">
            THE UNSENT PROJECT
          </h1>
          <p className="text-accent mt-1 font-sans text-xs font-black tracking-[0.3em] uppercase bg-secondary px-2 py-0.5 inline-block">
            MESSAGES LEFT UNSAID
          </p>
        </div>

        <div className="relative w-full max-w-md group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-primary group-focus-within:text-accent transition-colors">
            <Search className="h-5 w-5 stroke-[3px]" />
          </div>
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="TYPE A NAME..." 
            className="pl-10 h-14 rounded-none border-4 border-primary bg-secondary/20 hover:bg-secondary/40 focus:bg-background focus:border-accent transition-all duration-300 font-black text-xl placeholder:text-muted-foreground/50 uppercase italic"
          />
        </div>
      </div>
    </header>
  );
}
