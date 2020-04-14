export default class PageDTO {
  public _id: string
  public page_title?: string
  public page_content?: string
  public page_author: {
    _id: string
    user_name: string
  }
  public created_at: string
  public updated_at: string
  public page_status: number
  public comment_status: number
  public page_views: number
  public comment_count: number
}
