import * as appService from '@/services/app.js';
export default {
  namespace: 'app',
  state: {
    menu: [],
    setting: {},
  },
  effects: {
    * indexMenu({}, { select, call, put }) {
      console.log('app=>model=>indexMenu');
      const result = yield call(appService.indexMenu);
      if (result.status === 200 ) {
        yield put({
          type: 'setMenu',
          payload: result.data.son,
        });
      }
    },
    * indexSetting({}, { select, call, put }) {
      console.log('app=>model=>indexSetting');
      const result = yield call(appService.indexSetting);
      if (result.status === 200 ) {
        yield put({
          type: 'setSetting',
          payload: result.data,
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        dispatch({
          type: 'indexMenu',
          payload: {},
        });
        dispatch({
          type: 'indexSetting',
          payload: {},
        });
      });
    },
  },
  reducers: {
    setMenu(state, { payload: values }) {
      return { ...state, menu: values };
    },
    setSetting(state, { payload: values }) {
      return { ...state, setting: values };
    },
  },
};
