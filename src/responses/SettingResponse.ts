import SettingDTO from '@/types/SettingDTO'
import { Type } from 'class-transformer'
import BaseResponse from './BaseResponse'

export default class SettingResponse extends BaseResponse {
  @Type(() => SettingDTO)
  public data: SettingDTO
}
