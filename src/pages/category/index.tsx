import React, { useEffect } from 'react';
import { Pagination, Spin, Empty } from 'antd';
import { routerRedux } from 'dva/router';
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch, AnyAction } from 'redux';
import { withRouter, match } from "react-router";
import PostListItem from '@/components/PostListItem';
import { IndexPostListParamsType } from '@/services/post';
import { SettingStateType } from '@/models/setting';
import { PostStateType } from '@/models/post';
import { MenuStateType } from '@/models/menu';
import { GlobalStoreType } from '@/types/globalStore';
import styles from './index.less';

interface CategoryProps {
  dispatch: Dispatch<AnyAction>;
  computedMatch: match;
}

const Category = (props: CategoryProps) => {

  const { setting } = useSelector<GlobalStoreType, SettingStateType>(state => state.setting);
  const { menu, currentCategoryPath } = useSelector<GlobalStoreType, MenuStateType>(state => state.menu);
  const post = useSelector<GlobalStoreType, PostStateType>(state => state.post);
  const dispatch = useDispatch();

  /**
   * 获取数据
   */
  useEffect(() => {
    if (menu.length > 0) {
      getData();
    }
  }, [props.location.search, props.location.pathname, menu]);

  /**
   * 获取数据的函数
   */
  const getData = () => {
    const params = props.computedMatch.params;
    const query = props.location.query;
    const condition = {};
    params.tagName && (condition.tag_name = params.tagName);
    params.authorName && (condition.user_name = params.authorName);
    const idEn = params.secondCategory || params.firstCategory;
    if (idEn) {
      condition.category_id = menu.find(item => item.category_title_en === idEn)._id;
    }
    dispatch({
      type: 'post/indexPostList',
      payload: {...condition, post_status: [0], ...query},
    });
    // 设置菜单高亮
    const path = [];
    params.firstCategory && path.push(params.firstCategory);
    params.secondCategory && path.push(params.secondCategory);
    dispatch({
      type: 'menu/setCurrentCategoryPath',
      payload: path,
    })
  };

  /**
   * 分页事件
   * @param page
   * @param pageSize
   */
  const onPaginationChange = (page: IndexPostListParamsType, limit: IndexPostListParamsType) => {
    dispatch(
      routerRedux.push({
        query: {...props.location.query, page, limit}
      })
    );
  };

  /**
   * 获取title文案
   */
  const getTitle = () => {
    console.log('getTitle', props);
    const authorName = props.computedMatch.params.authorName;
    const tagName = props.computedMatch.params.tagName;
    if (authorName) {

      return `作者“${authorName}”下的所有文章`;
    } else if (tagName) {
      return `标签“${tagName}”下的所有文章`;
    } else {
      return '';
    }
  };

  const currentMenu = menu.find(item => item.category_title_en === currentCategoryPath[currentCategoryPath.length - 1]);

  return (
    <Spin spinning={post.loading}>
      <div className="container">
        <Helmet>
          {currentMenu && <title>{`${currentMenu.category_title}_${setting.site_name}`}</title>}
          {getTitle() !== '' && getTitle()}
          {props.computedMatch.path === '/' && <title>{`首页_${setting.site_name}`}</title>}
        </Helmet>
        {getTitle() !== '' && <div className={styles.title}>{getTitle()}</div>}
        {
          post.list.length > 0 ?
            <>
              <PostListItem list={post.list}/>
              <div className={styles.pagination}>
                <Pagination
                  defaultCurrent={props.location.query.page * 1 || 1}
                  total={post.total}
                  pageSize={props.location.query.limit * 1 || 10}
                  onChange={onPaginationChange}
                />
              </div>
            </>
            :
            !post.loading ?
              <Empty description="没有找到文章"/>
              :
              null
        }
      </div>
    </Spin>
  )
}

export default withRouter(Category);
