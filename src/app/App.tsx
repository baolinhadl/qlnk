import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FloatingNav } from './components/FloatingNav';
import { SearchCommand } from './components/SearchCommand';
import { BentoGrid } from './components/BentoGrid';
import { QuickActions } from './components/QuickActions';
import { StorageOrb } from './components/StorageOrb';
import { FileVault } from './components/FileVault';
import type { FileItem } from './types';

const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Project Nebula',
    type: 'folder',
    owner: 'You',
    modified: 'Dec 18, 2024',
    created: 'Nov 2, 2024',
    starred: false,
    color: '#8B5CF6',
    itemCount: 24,
  },
  {
    id: '2',
    name: 'Cosmic Gallery',
    type: 'image',
    size: '15.2 MB',
    owner: 'You',
    modified: 'Dec 10, 2024',
    created: 'Dec 5, 2024',
    starred: true,
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
    color: '#EC4899',
  },
  {
    id: '3',
    name: 'Neural Presentation',
    type: 'document',
    size: '2.4 MB',
    owner: 'You',
    modified: 'Dec 19, 2024',
    created: 'Dec 18, 2024',
    starred: false,
    color: '#3B82F6',
  },
  {
    id: '4',
    name: 'Team Sync',
    type: 'video',
    size: '145 MB',
    owner: 'John Doe',
    modified: 'Dec 17, 2024',
    created: 'Dec 17, 2024',
    starred: true,
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=600&fit=crop',
    color: '#10B981',
  },
  {
    id: '5',
    name: 'Design System',
    type: 'folder',
    owner: 'Design Team',
    modified: 'Dec 16, 2024',
    created: 'Dec 12, 2024',
    starred: false,
    color: '#F59E0B',
    itemCount: 156,
  },
  {
    id: '6',
    name: 'Sunset Dreams',
    type: 'image',
    size: '8.7 MB',
    owner: 'Sarah Lee',
    modified: 'Dec 14, 2024',
    created: 'Dec 10, 2024',
    starred: true,
    thumbnail: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=600&h=600&fit=crop',
    color: '#EF4444',
  },
  {
    id: '7',
    name: 'Audio Waves',
    type: 'audio',
    size: '45 MB',
    owner: 'You',
    modified: 'Dec 12, 2024',
    created: 'Dec 11, 2024',
    starred: false,
    color: '#06B6D4',
  },
  {
    id: '8',
    name: 'Contract Blueprint',
    type: 'document',
    size: '856 KB',
    owner: 'You',
    modified: 'Dec 11, 2024',
    created: 'Dec 5, 2024',
    starred: false,
    color: '#8B5CF6',
  },
  {
    id: '9',
    name: 'Ocean Vista',
    type: 'image',
    size: '4.2 MB',
    owner: 'You',
    modified: 'Dec 8, 2024',
    created: 'Dec 1, 2024',
    starred: false,
    thumbnail: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&h=600&fit=crop',
    color: '#6366F1',
  },
  {
    id: '10',
    name: 'Marketing Hub',
    type: 'folder',
    owner: 'Marketing',
    modified: 'Dec 5, 2024',
    created: 'Nov 15, 2024',
    starred: false,
    color: '#EC4899',
    itemCount: 89,
  },
  {
    id: '11',
    name: 'Tutorial Series',
    type: 'video',
    size: '256 MB',
    owner: 'You',
    modified: 'Dec 3, 2024',
    created: 'Nov 28, 2024',
    starred: true,
    thumbnail: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=600&h=600&fit=crop',
    color: '#F59E0B',
  },
  {
    id: '12',
    name: 'Mountain Peak',
    type: 'image',
    size: '6.8 MB',
    owner: 'You',
    modified: 'Dec 1, 2024',
    created: 'Nov 25, 2024',
    starred: false,
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
    color: '#10B981',
  },
];

export default function App() {
  const [activeView, setActiveView] = useState('vault');
  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const handleStarToggle = (id: string) => {
    setFiles(files.map(file => 
      file.id === id ? { ...file, starred: !file.starred } : file
    ));
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayFiles = activeView === 'starred'
    ? filteredFiles.filter(f => f.starred)
    : filteredFiles;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Main Container */}
        <div className="relative z-10">
          {/* Header */}
          <header className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Vault
                  </h1>
                  <p className="text-xs text-gray-400">Your digital universe</p>
                </div>
              </div>

              <StorageOrb used={45.3} total={100} />
            </div>
          </header>

          {/* Search Command */}
          <div className="px-8 mb-8">
            <SearchCommand 
              value={searchQuery} 
              onChange={setSearchQuery}
            />
          </div>

          {/* Main Content */}
          <div className="px-8 pb-20">
            {activeView === 'vault' ? (
              <BentoGrid 
                files={displayFiles} 
                onFileClick={setSelectedFile}
                onStarToggle={handleStarToggle}
              />
            ) : (
              <FileVault 
                files={displayFiles}
                onFileClick={setSelectedFile}
                onStarToggle={handleStarToggle}
              />
            )}
          </div>
        </div>

        {/* Floating Navigation */}
        <FloatingNav 
          activeView={activeView}
          onViewChange={setActiveView}
        />

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </DndProvider>
  );
}
