export interface AgenceRequest {

  id: number
  name: string;
  address: string;
  telephone: string;
  email: string;
  agentCreatedBy: string;
  agentUpdatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  multipartFiles: FileList;
}
