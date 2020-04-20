import PageDTO from '@/types/PageDTO'
import { Type } from 'class-transformer'
import BaseResponse from './BaseResponse'

export default class PageResponse extends BaseResponse {
  @Type(() => PageDTO)
  public data: PageDTO
}
