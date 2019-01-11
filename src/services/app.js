import request from '@/utils/request';

export const indexMenu = () => {
  console.log('app=>service=>indexMenu');
  return request({
    url: '/categories',
    method: 'get',
  })
};

export const indexSetting = () => {
  console.log('app=>service=>indexSetting');
  return request({
    url: '/settings',
    method: 'get',
  })
};
