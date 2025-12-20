import { Layers, Star, Clock, Users, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface FloatingNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: 'vault', icon: Layers, label: 'Vault' },
  { id: 'starred', icon: Star, label: 'Starred' },
  { id: 'recent', icon: Clock, label: 'Recent' },
  { id: 'shared', icon: Users, label: 'Shared' },
  { id: 'quick', icon: Zap, label: 'Quick' },
];

export function FloatingNav({ activeView, onViewChange }: FloatingNavProps) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-4 py-3 shadow-2xl">
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className="relative group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-black/90 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap">
                    {item.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
