import { MediaDto } from "../agence/media-dto";
import { UserDto } from "./user-dto";

export interface UserResponse
{
  userDto: UserDto;
  agence: any;
  medias: MediaDto[];
}
