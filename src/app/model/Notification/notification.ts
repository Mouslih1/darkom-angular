export interface Notification
{
  key: string,
  message: string;
  relatedId: number;
  receivedId: number;
  senderUsername: string;
  agenceId: number;
  createdAt: Date;
  seen: boolean;
}
