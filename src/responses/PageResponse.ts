import BaseResponse from './BaseResponse'
import PageDTO from '@/types/PageDTO'
import { Type } from 'class-transformer'

export default class PageResponse extends BaseResponse {
  @Type(() => PageDTO)
  public data: PageDTO
}
