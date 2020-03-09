import BaseResponse from '../BaseResponse';
import PostDTO from '@/types/PostDTO';
import { Type } from "class-transformer";

export default class ListResponse extends BaseResponse {
  @Type(() => Data)
  public data : Data;
}

class Data {
  @Type(() => PostDTO)
  public list: PostDTO[];
  public total: number;
}
