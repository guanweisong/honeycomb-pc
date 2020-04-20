import MenuDTO from '@/types/MenuDTO'
import { Type } from 'class-transformer'
import BaseResponse from './BaseResponse'

export default class MenuResponse extends BaseResponse {
  @Type(() => MenuDTO)
  public data: CategoryList
}

class CategoryList {
  @Type(() => MenuDTO)
  public list: MenuDTO[]
}
