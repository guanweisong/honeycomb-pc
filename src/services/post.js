import request from '@/utils/request';

export const indexPostList = (params) => {
  console.log('category=>service=>indexPostList');
  return request({
    url: '/posts',
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
