import request from '@/utils/request';

export const indexMenu = () => {
  console.log('app=>service=>indexMenu');
  return request({
    url: '/categories',
    method: 'get',
  })
};
