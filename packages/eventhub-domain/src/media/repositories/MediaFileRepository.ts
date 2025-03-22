import { Repository } from '../../core/interfaces/Repository';
import { MediaFile, MediaEntityType } from '../entities/MediaFile';
import { FileTypeEnum } from '../value-objects/FileType';

export interface MediaFileFilters {
  fileName?: string;
  fileType?: FileTypeEnum;
  entityId?: string;
  entityType?: MediaEntityType;
  isPublic?: boolean;
  isActive?: boolean;
  minSize?: number;
  maxSize?: number;
  query?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface MediaFileRepository extends Repository<string, MediaFile> {
  findAll(filters?: MediaFileFilters, pagination?: PaginationOptions): Promise<{
    mediaFiles: MediaFile[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  
  findByFileName(fileName: string): Promise<MediaFile[]>;
  
  findByEntityId(entityId: string, entityType: MediaEntityType): Promise<MediaFile[]>;
  
  findByFileType(fileType: FileTypeEnum): Promise<MediaFile[]>;
  
  findPublicFiles(): Promise<MediaFile[]>;
  
  findPrivateFiles(): Promise<MediaFile[]>;
  
  findActiveFiles(): Promise<MediaFile[]>;
  
  findInactiveFiles(): Promise<MediaFile[]>;
  
  searchByText(query: string): Promise<MediaFile[]>;
} 