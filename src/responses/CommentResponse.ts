import CommentDTO from '@/types/CommentDTO'
import { Type } from 'class-transformer'
import BaseResponse from './BaseResponse'

class Data {
  @Type(() => CommentDTO)
  public list: CommentDTO[]

  public total: number
}

export default class CommentResponse extends BaseResponse {
  @Type(() => Data)
  public data: Data
}
