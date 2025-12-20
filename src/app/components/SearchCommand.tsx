import { Search, Command } from 'lucide-react';
import { motion } from 'motion/react';

interface SearchCommandProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchCommand({ value, onChange }: SearchCommandProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative max-w-2xl mx-auto"
    >
      <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative flex items-center">
          <Search className="absolute left-5 w-5 h-5 text-gray-400" />
          
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search your vault..."
            className="w-full pl-14 pr-24 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none"
          />

          <div className="absolute right-5 flex items-center gap-2 text-xs text-gray-400">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
