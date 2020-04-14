import BaseResponse from './BaseResponse'
import MenuDTO from '@/types/MenuDTO'
import { Type } from 'class-transformer'

export default class MenuResponse extends BaseResponse {
  @Type(() => MenuDTO)
  public data: CategoryList
}

class CategoryList {
  @Type(() => MenuDTO)
  public list: MenuDTO[]
}
