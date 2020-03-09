import TagDTO from './TagDTO';
import { Type } from "class-transformer";

export default class PostDTO {
  public _id: string;
  public post_title?: string;
  public post_content?: string;
  public post_excerpt?: string;
  public post_category: {
    _id: string;
    category_title: string;
  };
  public post_author: {
    _id: string;
    user_name: string;
  };
  public created_at: string;
  public updated_at: string;
  public post_status: number;
  public comment_status: number;
  public post_views: number;
  public post_type: number;
  public post_cover?: {
    _id: string;
    media_url: string;
    media_url_720p?: string;
    media_url_360p?: string;
  };
  public movie_time?: string;
  public movie_name_en?: string;
  @Type(() => TagDTO)
  public movie_director?: TagDTO [];
  @Type(() => TagDTO)
  public movie_actor?: TagDTO [];
  @Type(() => TagDTO)
  public movie_style?: TagDTO [];
  public gallery_location?: string;
  public gallery_time?: string;
  @Type(() => TagDTO)
  public gallery_style?: TagDTO [];
  public quote_author?: string;
  public quote_content?: string;
  public comment_count: number;
}
