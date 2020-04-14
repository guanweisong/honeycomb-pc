import 'reflect-metadata'

export default class BaseResponse {
  public status: number = 0

  /**
   * status在200-300区间内表示成功
   */
  public isSuccess(): boolean {
    return this.status >= 200 && this.status < 300
  }
}
