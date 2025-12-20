import { Plus, Upload, FolderPlus, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: Upload, label: 'Upload File', color: 'from-blue-500 to-cyan-500' },
    { icon: FolderPlus, label: 'New Folder', color: 'from-purple-500 to-pink-500' },
    { icon: Link, label: 'Share Link', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-20 right-0 space-y-3"
          >
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center gap-3 w-full"
                >
                  <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {action.label}
                  </span>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="w-7 h-7" />
        </motion.div>
      </motion.button>
    </div>
  );
}
