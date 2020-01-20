import { Effect } from 'dva';
import { Reducer } from 'redux';
import { PostType } from '@/types/post';

import * as postsService from '@/services/post';

export interface PostStateType {
  list: PostType [];
  total: number;
  loading: boolean;
  detail: {
    string?: PostType,
  };
  randomPostsList: {
    string?: PostType,
  };
}

export interface PostModelType {
  namespace: string;
  state: PostStateType;
  effects: {
    indexPostList: Effect;
    indexPostDetail: Effect;
    indexRandomPostByCategoryId: Effect;
  };
  reducers: {
    saveListData: Reducer<PostStateType>;
    saveDetailData: Reducer<PostStateType>;
    saveRandomPostsListData: Reducer<PostStateType>;
    switchLoading: Reducer<PostStateType>;
  };
}

const Model: PostModelType = {
  namespace: 'post',
  state: {
    list: [],
    total: 0,
    loading: true,
    detail: {},
    randomPostsList: {},
  },
  effects: {
    * indexPostList({ payload }, { call, put }) {
      console.log('category=>model=>indexPostList');
      yield put({
        type: 'switchLoading',
        payload: true,
      });
      const result = yield call(postsService.indexPostList, payload);
      if (result.status === 200 ) {
        yield put({
          type: 'saveListData',
          payload: {
            list: result.data.list,
            total: result.data.total,
          },
        });
      }
      yield put({
        type: 'switchLoading',
        payload: false,
      });
    },
    * indexPostDetail({ payload }, { call, put }) {
      console.log('category=>model=>indexPostDtail');
      yield put({
        type: 'switchLoading',
        payload: true,
      });
      const result = yield call(postsService.indexPostDetail, payload);
      const post = result.data;
      yield put({
        type: 'saveDetailData',
        payload: post,
      });
      yield put({
        type: 'switchLoading',
        payload: false,
      });
    },
    * indexRandomPostByCategoryId({ payload }, { call, put })  {
      console.log('category=>model=>indexRandomPostByCategoryId');
      const result = yield call(postsService.indexRandomPostByCategoryId, payload);
      yield put({
        type: 'saveRandomPostsListData',
        payload: {
          value: result.data,
          id: payload.post_id,
        },
      });
    },
  },
  reducers: {
    // @ts-ignore
    saveListData(state, { payload: { list, total } }) {
      return { ...state, list, total };
    },
    // @ts-ignore
    saveDetailData(state, { payload: value }) {
      // @ts-ignore
      return { ...state, detail: {...state.detail, [value._id]: value} };
    },
    // @ts-ignore
    saveRandomPostsListData(state, { payload: {value, id} }) {
      // @ts-ignore
      return { ...state, randomPostsList: {...state.randomPostsList, [id]: value} };
    },
    // @ts-ignore
    switchLoading(state, { payload: value }) {
      return { ...state, loading: value };
    },
  },
};

export default Model;