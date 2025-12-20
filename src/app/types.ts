export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'image' | 'document' | 'video' | 'audio' | 'other';
  size?: string;
  owner: string;
  modified: string;
  created: string;
  starred: boolean;
  thumbnail?: string;
  color: string;
  itemCount?: number;
}
