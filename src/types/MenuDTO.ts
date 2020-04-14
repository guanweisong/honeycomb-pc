import { Type } from 'class-transformer'

export default class MenuDTO {
  _id: string
  type: string
  created_at: string
  updated_at: string
  category_title_en?: string
  category_title?: string
  page_title?: string
  isHome?: boolean
  category_parent?: string
  @Type(() => MenuDTO)
  children: MenuDTO[]
}
