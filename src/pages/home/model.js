import * as postsService from './service';
export default {
  namespace: 'posts',
  state: {
    list: [],
    total: null,
  },
  effects: {
    * indexPostList({}, { select, call, put }) {
      console.log('app=>model=>indexMenu');
      const result = yield call(postsService.indexPostList);
      if (result.status === 200 ) {
        yield put({
          type: 'saveListData',
          payload: {
            list: result.data.list,
            total: result.data.total,
          },
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/home') {
          dispatch({
            type: 'indexPostList',
            payload: history.location.query,
          });
        }
      });
    },
  },
  reducers: {
    saveListData(state, { payload: { list, total } }) {
      return { ...state, list, total };
    },
  },
};
