import { ValueObject } from '../../core/interfaces/ValueObject';

export enum FileTypeEnum {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  OTHER = 'other'
}

/**
 * Representa el tipo de archivo
 */
export class FileType implements ValueObject<FileTypeEnum> {
  private readonly _value: FileTypeEnum;

  private constructor(value: FileTypeEnum) {
    this._value = value;
  }

  /**
   * Crea un tipo de archivo a partir del nombre de archivo
   */
  public static fromFilename(filename: string): FileType {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    if (!extension) {
      return FileType.unknown();
    }
    
    if (FileType.isImageExtension(extension)) {
      return new FileType(FileTypeEnum.IMAGE);
    }
    
    if (FileType.isVideoExtension(extension)) {
      return new FileType(FileTypeEnum.VIDEO);
    }
    
    if (FileType.isAudioExtension(extension)) {
      return new FileType(FileTypeEnum.AUDIO);
    }
    
    if (FileType.isDocumentExtension(extension)) {
      return new FileType(FileTypeEnum.DOCUMENT);
    }
    
    return FileType.unknown();
  }

  /**
   * Devuelve el valor del tipo de archivo
   */
  public value(): FileTypeEnum {
    return this._value;
  }

  /**
   * Compara con otro ValueObject
   */
  public equals(vo: ValueObject<FileTypeEnum>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    
    return this.value() === vo.value();
  }

  public static create(value: string): FileType {
    if (!this.isValidType(value)) {
      throw new Error(`Tipo de archivo inválido: ${value}`);
    }
    
    return new FileType(value as FileTypeEnum);
  }

  private static isValidType(value: string): boolean {
    return Object.values(FileTypeEnum).includes(value as FileTypeEnum);
  }

  public static fromMimeType(mimeType: string): FileType {
    if (mimeType.startsWith('image/')) {
      return new FileType(FileTypeEnum.IMAGE);
    }
    
    if (mimeType.startsWith('video/')) {
      return new FileType(FileTypeEnum.VIDEO);
    }
    
    if (mimeType.startsWith('audio/')) {
      return new FileType(FileTypeEnum.AUDIO);
    }
    
    if (
      mimeType === 'application/pdf' ||
      mimeType === 'application/msword' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/vnd.ms-excel' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      mimeType === 'application/vnd.ms-powerpoint' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      mimeType === 'text/plain'
    ) {
      return new FileType(FileTypeEnum.DOCUMENT);
    }
    
    return new FileType(FileTypeEnum.OTHER);
  }

  public isImage(): boolean {
    return this._value === FileTypeEnum.IMAGE;
  }

  public isVideo(): boolean {
    return this._value === FileTypeEnum.VIDEO;
  }

  public isAudio(): boolean {
    return this._value === FileTypeEnum.AUDIO;
  }

  public isDocument(): boolean {
    return this._value === FileTypeEnum.DOCUMENT;
  }

  public isOther(): boolean {
    return this._value === FileTypeEnum.OTHER;
  }

  public getValue(): FileTypeEnum {
    return this._value;
  }

  private static isImageExtension(extension: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'];
    return imageExtensions.includes(extension);
  }

  private static isVideoExtension(extension: string): boolean {
    const videoExtensions = ['mp4', 'avi', 'mkv', 'mov', 'wmv'];
    return videoExtensions.includes(extension);
  }

  private static isAudioExtension(extension: string): boolean {
    const audioExtensions = ['mp3', 'wav', 'ogg', 'flac'];
    return audioExtensions.includes(extension);
  }

  private static isDocumentExtension(extension: string): boolean {
    const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
    return documentExtensions.includes(extension);
  }

  private static unknown(): FileType {
    return new FileType(FileTypeEnum.OTHER);
  }
} 