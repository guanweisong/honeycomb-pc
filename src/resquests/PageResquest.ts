import request from '@/utils/request'

export default class PageRequest {
  /**
   * 查询页面详情
   * @param id
   */
  public static indexPageDetail(id: string) {
    return request({
      url: `/pages/detail/${id}`,
      method: 'get',
    })
  }
}
