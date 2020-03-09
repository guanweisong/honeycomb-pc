import { Type } from "class-transformer";

export default class MenuDTO {
  _id: string;
  category_title: string;
  category_title_en: string;
  category_parent: string;
  category_description?: string;
  category_status: number;
  created_at: string;
  updated_at: string;
  isHome: string;
  @Type(() => MenuDTO)
  children: MenuDTO[];
}