import { ResponseType } from '../base.typing';

export type UploadImage = {
  url: string;
  mimeType: string;
  width?: number | null;
  height?: number | null;
  size: number;
  format?: 'jpeg' | 'png' | 'webp' | 'gif' | 'svg' | 'bmp' | 'tiff' | string;
};

type UploadResponseType = ResponseType<UploadImage>;

export type { UploadResponseType };
