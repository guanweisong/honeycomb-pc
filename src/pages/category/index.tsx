import React, { useEffect } from 'react';
import { Pagination, Spin, Empty } from 'antd';
import router from 'umi/router';
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
import H from 'history';

interface Location extends H.Location {
  query: {[key: string]: string};
}

interface PathParams {
  user_name: string;
  tag_name: string;
}

interface CategoryProps {  
  dispatch: Dispatch<AnyAction>;
  computedMatch: match<PathParams>;
  location: Location;
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
    // @ts-ignore
    const params: IndexPostListParamsType = props.computedMatch.params;
    const query = props.location.query;
    const condition: IndexPostListParamsType = {};
    params.tag_name && (condition.tag_name = params.tag_name);
    params.user_name && (condition.user_name = params.user_name);
    const idEn = params.secondCategory || params.firstCategory;
    if (idEn) {
      condition.category_id = menu.find(item => item.category_title_en === idEn)?._id;
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
  const onPaginationChange = (page: number, limit?: number) => {
    router.push({
      pathname: props.location.pathname,
      query: {...props.location.query, page, limit}
    });
  };

  /**
   * 获取title文案
   */
  const getTitle = () => {
    console.log('getTitle', props);
    const user_name = props.computedMatch.params.user_name;
    const tag_name = props.computedMatch.params.tag_name;
    if (user_name) {
      return `作者“${user_name}”下的所有文章`;
    } else if (tag_name) {
      return `标签“${tag_name}”下的所有文章`;
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
                  defaultCurrent={parseInt(props.location.query.page, 10) || 1}
                  total={post.total}
                  pageSize={parseInt(props.location.query.limit, 10) || 10}
                  onChange={(page, pageSize) => onPaginationChange(page, pageSize)}
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

// @ts-ignore
export default withRouter(Category);
