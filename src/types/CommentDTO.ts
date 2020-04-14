import { Type } from 'class-transformer'

export default class CommentDTO {
  public _id: string
  public comment_post: string
  public comment_author: string
  public comment_email: string
  public comment_ip: string
  public created_at: string
  public updated_at: string
  public comment_content: string
  public comment_status: number
  public comment_agent: string
  public comment_parent: string
  public comment_avatar: string
  @Type(() => CommentDTO)
  public children: CommentDTO[]
}
