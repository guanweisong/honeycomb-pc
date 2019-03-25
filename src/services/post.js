import request from '@/utils/request';

export const indexPostByCategoryId = (params) => {
  console.log('category=>service=>indexPostByCategoryId');
  return request({
    url: '/posts/indexPostByCategoryId',
    method: 'get',
    params: params,
  })
};


export const indexRandomPostByCategoryId = (params) => {
  console.log('category=>service=>indexRandomPostByCategoryId');
  return request({
    url: '/posts/indexRandomPostByCategoryId',
    method: 'get',
    params: params,
  })
};
