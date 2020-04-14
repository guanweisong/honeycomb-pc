import request from '@/utils/request'

export interface IndexPostListParamsType {
  category_id?: string
  post_status?: number[]
  page?: number
  limit?: number
  tag_name?: string[]
  user_name?: string
  firstCategory?: string
  secondCategory?: string
}

export interface IndexRandomPostListParamsType {
  number?: number
  post_category: string
  post_id: string
}

export default class PostRequest {
  /**
   * 查询文章列表
   * @param params
   */
  public static indexPostList(params: IndexPostListParamsType) {
    return request({
      url: `/posts/list`,
      method: 'get',
      params: params,
    })
  }

  /**
   * 查询文章详情
   * @param id
   */
  public static indexPostDetail(id: string) {
    return request({
      url: `/posts/detail/${id}`,
      method: 'get',
    })
  }

  /**
   * 查询随机文章列表
   * @param params
   */
  public static indexRandomPostByCategoryId(params: IndexRandomPostListParamsType) {
    return request({
      url: '/posts/list/random',
      method: 'get',
      params: params,
    })
  }
}
