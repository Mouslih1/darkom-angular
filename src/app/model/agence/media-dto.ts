export interface MediaDto {

  id: number;
  mediaUuid: string;
  filename: string;
  uri: string;
  relatedId: number;
  mediaStatus: MediaStatus;
  fileType: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum MediaStatus {

  LOGO_AGENCE,
  PHOTO_PROFIL,
  ANNONCE_PHOTO
}
