import SettingResquest from '@/resquests/SettingResquest';
import { createModel } from "hox";
import { useState } from 'react';
import { plainToClass } from "class-transformer";
import SettingResponse from '@/responses/SettingResponse';

function UseSetting() {
  const [setting, setSetting] = useState({});

  /**
   * 查询网站设置信息
   */
  const indexSetting = async () => {
    const result = await SettingResquest.indexSetting();
    const response = plainToClass(SettingResponse, result);
    console.log('indexSetting', response);
    if (response.isSuccess()) {
      setSetting(response.data);
    }
  }

  return {
    setting,
    indexSetting,
  }
}

export default createModel(UseSetting);
