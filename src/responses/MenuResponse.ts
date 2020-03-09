import BaseResponse from './BaseResponse';
import MenuDTO from '@/types/MenuDTO';
import { Type } from "class-transformer";

export default class MenuResponse extends BaseResponse {
  @Type(() => MenuList)
  public data : MenuList;
}

class MenuList {
  @Type(() => MenuDTO)
  public son: MenuDTO[];

  @Type(() => MenuDTO)
  public family: MenuDTO[];
}
