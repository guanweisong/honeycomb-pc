import * as postsService from '@/services/post';
export default {
  namespace: 'posts',
  state: {
    list: [],
    total: null,
    loading: false,
    detail: null,
  },
  effects: {
    * indexPostList({ payload }, { select, call, put }) {
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
    * indexPostDetail({ payload }, { select, call, put }) {
      console.log('category=>model=>indexPostDtail');
      yield put({
        type: 'switchLoading',
        payload: true,
      });
      const result = yield call(postsService.indexPostList, payload);
      yield put({
        type: 'saveDetailData',
        payload: result.data.list[0],
      });
      yield put({
        type: 'switchLoading',
        payload: false,
      });
    }
  },
  subscriptions: {},
  reducers: {
    saveListData(state, { payload: { list, total } }) {
      return { ...state, list, total };
    },
    saveDetailData(state, { payload: value }) {
      return { ...state, detail: value };
    },
    switchLoading(state, { payload: value }) {
      return { ...state, loading: value };
    },
  },
};
