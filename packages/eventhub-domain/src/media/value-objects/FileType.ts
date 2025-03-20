import { ValueObject } from '../../core/interfaces/ValueObject';

export enum FileTypeEnum {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  OTHER = 'other'
}

export class FileType implements ValueObject<FileTypeEnum> {
  private readonly _value: FileTypeEnum;

  private constructor(value: FileTypeEnum) {
    this._value = value;
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

  get value(): FileTypeEnum {
    return this._value;
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

  public equals(valueObject: FileType): boolean {
    if (!(valueObject instanceof FileType)) {
      return false;
    }
    
    return this._value === valueObject._value;
  }

  public getValue(): FileTypeEnum {
    return this._value;
  }
} 