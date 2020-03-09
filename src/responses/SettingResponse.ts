import BaseResponse from './BaseResponse';
import SettingDTO from '@/types/SettingDTO';
import { Type } from "class-transformer";

export default class SettingResponse extends BaseResponse {
  @Type(() => SettingDTO)
  public data: SettingDTO;
}
