import BaseResponse from '../BaseResponse';
import PostDTO from '@/types/PostDTO';
import { Type } from "class-transformer";

export default class RadomResponse extends BaseResponse {
  @Type(() => PostDTO)
  public data : PostDTO[];
}
