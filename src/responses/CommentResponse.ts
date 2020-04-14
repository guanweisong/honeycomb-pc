import BaseResponse from './BaseResponse'
import CommentDTO from '@/types/CommentDTO'
import { Type } from 'class-transformer'

export default class CommentResponse extends BaseResponse {
  @Type(() => Data)
  public data: Data
}

class Data {
  @Type(() => CommentDTO)
  public list: CommentDTO[]
  public total: nmumber
}
