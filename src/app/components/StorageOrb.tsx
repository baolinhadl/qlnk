import { motion } from 'motion/react';

interface StorageOrbProps {
  used: number;
  total: number;
}

export function StorageOrb({ used, total }: StorageOrbProps) {
  const percentage = (used / total) * 100;
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative group">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="relative cursor-pointer"
      >
        {/* Animated SVG Circle */}
        <svg className="w-20 h-20 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="6"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="40"
            cy="40"
            r="36"
            stroke="url(#gradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs font-semibold">{Math.round(percentage)}%</div>
          </div>
        </div>
      </motion.div>

      {/* Tooltip */}
      <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="backdrop-blur-xl bg-black/90 border border-white/10 rounded-xl px-4 py-3 text-sm whitespace-nowrap">
          <div className="font-semibold">{used} GB / {total} GB</div>
          <div className="text-xs text-gray-400 mt-1">{(total - used).toFixed(1)} GB free</div>
        </div>
      </div>
    </div>
  );
}
