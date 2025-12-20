import { Folder, Star, MoreVertical, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import type { FileItem } from '../types';

interface BentoGridProps {
  files: FileItem[];
  onFileClick: (file: FileItem) => void;
  onStarToggle: (id: string) => void;
}

export function BentoGrid({ files, onFileClick, onStarToggle }: BentoGridProps) {
  // Create bento layout pattern
  const getGridClass = (index: number) => {
    const patterns = [
      'col-span-2 row-span-2', // Large
      'col-span-1 row-span-1', // Small
      'col-span-1 row-span-2', // Tall
      'col-span-2 row-span-1', // Wide
      'col-span-1 row-span-1', // Small
      'col-span-1 row-span-1', // Small
    ];
    return patterns[index % patterns.length];
  };

  return (
    <div className="grid grid-cols-4 auto-rows-[200px] gap-4">
      {files.map((file, index) => (
        <motion.div
          key={file.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.03 }}
          className={getGridClass(index)}
        >
          <div
            onClick={() => onFileClick(file)}
            className="group relative h-full rounded-2xl overflow-hidden cursor-pointer"
            style={{
              background: file.thumbnail 
                ? `url(${file.thumbnail})` 
                : `linear-gradient(135deg, ${file.color}20, ${file.color}40)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            
            {/* Glass Effect */}
            <div className="absolute inset-0 backdrop-blur-[1px] group-hover:backdrop-blur-sm transition-all" />

            {/* Content */}
            <div className="relative h-full p-6 flex flex-col justify-between">
              {/* Top Actions */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {file.type === 'folder' && (
                    <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                      <Folder className="w-5 h-5" />
                    </div>
                  )}
                  {file.starred && (
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  )}
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onStarToggle(file.id);
                    }}
                    className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                  >
                    <Star 
                      className={`w-4 h-4 ${file.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} 
                    />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Bottom Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg truncate">{file.name}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  {file.type === 'folder' ? (
                    <span>{file.itemCount} items</span>
                  ) : (
                    <span>{file.size}</span>
                  )}
                  <span>•</span>
                  <span>{file.modified}</span>
                </div>
              </div>
            </div>

            {/* Hover Border Effect */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                boxShadow: `inset 0 0 0 2px ${file.color}40`,
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
