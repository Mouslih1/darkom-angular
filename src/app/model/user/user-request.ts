import { Role } from "./role";

export interface UserRequest
{
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  address: string;
  password?: string;
  telephone: string;
  role: Role;
  agentCreatedBy?: string;
  agentUpdatedBy?: string;
  agenceId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  dateNaissance: Date;
  multipartFiles: File[];
}
