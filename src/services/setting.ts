import request from '@/utils/request';

export const indexSetting = () => {
  console.log('app=>service=>indexSetting');
  return request({
    url: '/settings',
    method: 'get',
  })
};
