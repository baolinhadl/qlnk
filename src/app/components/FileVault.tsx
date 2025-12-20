import { Folder, Star, File, Image, Film, Music } from 'lucide-react';
import { motion } from 'motion/react';
import type { FileItem } from '../types';

interface FileVaultProps {
  files: FileItem[];
  onFileClick: (file: FileItem) => void;
  onStarToggle: (id: string) => void;
}

const icons: Record<string, any> = {
  folder: Folder,
  image: Image,
  document: File,
  video: Film,
  audio: Music,
};

export function FileVault({ files, onFileClick, onStarToggle }: FileVaultProps) {
  return (
    <div className="space-y-2">
      {files.map((file, index) => {
        const Icon = icons[file.type] || File;
        
        return (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02 }}
            onClick={() => onFileClick(file)}
            className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* Icon/Thumbnail */}
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: file.thumbnail 
                    ? `url(${file.thumbnail})` 
                    : `linear-gradient(135deg, ${file.color}, ${file.color}90)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!file.thumbnail && <Icon className="w-6 h-6" />}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{file.name}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                  <span>{file.owner}</span>
                  <span>•</span>
                  {file.type === 'folder' ? (
                    <span>{file.itemCount} items</span>
                  ) : (
                    <span>{file.size}</span>
                  )}
                  <span>•</span>
                  <span>{file.modified}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStarToggle(file.id);
                  }}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Star 
                    className={`w-4 h-4 ${file.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} 
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
