import * as commentsService from '@/services/comment';
import { message } from 'antd';

export default {
  namespace: 'comments',
  state: {
    list: [],
    total: 0,
    replyTo: null,
    loading: false,
  },
  effects: {
    * index({ payload }, { select, call, put }) {
      console.log('comment=>model=>indexCommentList');
      yield put({
        type: 'switchLoading',
        payload: true,
      });
      const result = yield call(commentsService.index, payload);
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
    * create({ payload: values }, { select, call, put }) {
      console.log('comment=>model=>create', values);
      const result = yield call(commentsService.create, values);
      if (result.status === 201) {
        message.success('发布成功');
        const id = yield select(state => state.posts.detail._id);
        yield put({
          type: 'index',
          payload: id,
        });
        values.callback && values.callback();
      }
    },
  },
  subscriptions: {},
  reducers: {
    saveListData(state, { payload: { list, total } }) {
      return { ...state, list, total };
    },
    switchLoading(state, { payload: value }) {
      return { ...state, loading: value };
    },
    setReplyTo(state, { payload: value }) {
      return { ...state, replyTo: value }
    },
  },
};
