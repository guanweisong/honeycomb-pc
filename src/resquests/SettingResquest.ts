import request from '@/utils/request';

export default class SettingRequest {
  /**
   * 查询网站配置信息
   */
  public static indexSetting() {
    return request({
      url: '/settings',
      method: 'get',
    })
  }
}
