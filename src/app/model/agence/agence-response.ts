import { AgenceDto } from "./agence-dto";
import { MediaDto } from "./media-dto";


export interface AgenceResponse {
    agenceDto: AgenceDto;
    medias: MediaDto[];
}
