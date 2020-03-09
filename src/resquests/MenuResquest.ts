import request from '@/utils/request';

export default class MenuRequest {
  /**
   * 查询菜单列表信息
   */
  public static indexMenu() {
    return request({
      url: '/categories',
      method: 'get',
    })
  }
}
