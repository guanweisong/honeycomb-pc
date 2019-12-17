import * as menuService from '@/services/menu';
import { MenuType } from '@/types/menu';
import { Reducer } from 'redux';
import { Effect } from 'dva';


export interface MenuStateType {
  menu: MenuType [];
  currentCategoryPath?: [];
}


export interface MenuModelType {
  namespace: string;
  state: MenuStateType;
  effects: {
    indexMenu: Effect;
  };
  reducers: {
    setMenu: Reducer<MenuStateType>;
    setCurrentCategoryPath: Reducer<MenuStateType>;
  };
}

const Model: MenuModelType = {
  namespace: 'menu',
  state: {
    menu: [],
    currentCategoryPath: [],
  },
  effects: {
    * indexMenu({}, { call, put }) {
      console.log('app=>model=>indexMenu');
      const result = yield call(menuService.indexMenu);
      if (result.status === 200) {
        yield put({
          type: 'setMenu',
          payload: result.data.son,
        });
      }
    },
  },
  reducers: {
    setMenu(state, { payload: values }) {
      return { ...state, menu: values };
    },
    setCurrentCategoryPath(state, { payload: values }) {
      return { ...state, currentCategoryPath: values };
    },
  },
}

export default Model;
