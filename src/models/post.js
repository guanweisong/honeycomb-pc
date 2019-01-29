import * as postsService from '@/services/post';
export default {
  namespace: 'posts',
  state: {
    list: [],
    total: null,
    loading: false,
    detail: null,
    randomPostsList: [],
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
      const post = result.data.list[0];
      yield put({
        type: 'saveDetailData',
        payload: post,
      });
      yield put({
        type: 'switchLoading',
        payload: false,
      });
      setTimeout(()=> {
        payload.callback && payload.callback();
      }, 0);
      const menu = yield select(state => state.app.menu);
      const thisCategory = menu.find(item => item._id === post.post_category._id);
      const parentCategory = menu.filter(item => item._id === thisCategory.category_parent);
      const categoryPath = parentCategory.length > 0 ? [parentCategory[0].category_title_en, thisCategory.category_title_en] : [thisCategory.category_title_en];
      yield put({
        type: 'app/setCurrentCategoryPath',
        payload: categoryPath,
      });
    },
    * indexRandomPostByCategoryId({ payload }, { select, call, put })  {
      console.log('category=>model=>indexRandomPostByCategoryId');
      const result = yield call(postsService.indexRandomPostByCategoryId, payload);
      yield put({
        type: 'saveRandomPostsListData',
        payload: result.data,
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
    saveRandomPostsListData(state, { payload: value }) {
      return { ...state, randomPostsList: value };
    },
    switchLoading(state, { payload: value }) {
      return { ...state, loading: value };
    },
  },
};
