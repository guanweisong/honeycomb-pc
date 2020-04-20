import { Type } from 'class-transformer'

export default class MenuDTO {
  public _id: string

  public type: string

  public created_at: string

  public updated_at: string

  public category_title_en?: string

  public category_title?: string

  public page_title?: string

  public isHome?: boolean

  public category_parent?: string

  @Type(() => MenuDTO)
  public children: MenuDTO[]
}
