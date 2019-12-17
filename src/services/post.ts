import request from '@/utils/request';

export interface IndexPostListParamsType {
  category_id?: string;
  post_status?: number [];
  page?: number;
  limit?: number;
  tag_name?: string [];
  user_name?: string;
}

export interface IndexRandomPostListParamsType {
  number?: number;
  post_category: string
}

export const indexPostList = (params: IndexPostListParamsType) => {
  console.log('post=>service=>indexPostList');
  return request({
    url: `/posts/list`,
    method: 'get',
    params: params,
  })
};

export const indexPostDetail = (id: string) => {
  console.log('post=>service=>indexPostDetail');
  return request({
    url: `/posts/detail/${id}`,
    method: 'get',
  })
}

export const indexRandomPostByCategoryId = (params: IndexRandomPostListParamsType) => {
  console.log('post=>service=>indexRandomPostByCategoryId');
  return request({
    url: '/posts/list/random',
    method: 'get',
    params: params,
  })
};
