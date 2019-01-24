import React, { PureComponent } from 'react';
import { Pagination, Spin, Empty } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Helmet } from "react-helmet";
import PostListItem from '@/components/PostListItem';
import styles from './index.less';

const mapStateToProps = (state) => state;

@connect(mapStateToProps)
class Category extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.getData(this.props.computedMatch.params);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.computedMatch.url !== this.props.computedMatch.url || nextProps.location.search !== this.props.location.search) {
      this.getData(nextProps.computedMatch.params);
    }
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'app/setCurrentCategoryPath',
      payload: [],
    })
  }
  getData = (params) => {
    const condition = {};
    if (!params.secondCategory && params.firstCategory) {
      const parentId = this.props.app.menu.find((item) => item.category_title_en === params.firstCategory)._id;
      const ids = [];
      this.props.app.menu.forEach((item) => {
        if (item.category_parent === parentId) {
          ids.push(item._id);
        }
      });
      condition.post_category = (ids.length ? ids : parentId);
      this.props.dispatch({
        type: 'app/setCurrentCategoryPath',
        payload: [params.firstCategory],
      })
    } else if (params.secondCategory) {
      condition.post_category = this.props.app.menu.find((item) => item.category_title_en === params.secondCategory)._id;
      this.props.dispatch({
        type: 'app/setCurrentCategoryPath',
        payload: [params.firstCategory, params.secondCategory],
      })
    } else if (params.tagName) {
      condition.tag_name = params.tagName;
    } else if (params.authorName) {
      condition.user_name = params.authorName;
    }
    console.log('getData', condition);
    this.props.dispatch({
      type: 'posts/indexPostList',
      payload: {...condition, post_status: 0, ...this.props.location.query},
    });
  };
  onPaginationChange = (page, pageSize) => {
    this.props.dispatch(
      routerRedux.push({
        query: {...this.props.location.query, page: page, limit: pageSize}
      })
    );
  };
  getTitle = () => {
    console.log('getTitle', this.props);
    const authorName = this.props.computedMatch.params.authorName;
    const tagName = this.props.computedMatch.params.tagName;
    if (authorName) {
      return `作者“${authorName}”下的所有文章`;
    } else if (tagName) {
      return `标签“${tagName}”下的所有文章`;
    } else {
      return '';
    }
  };
  render() {
    const currentMenu = this.props.app.menu.find(item => item.category_title_en === this.props.app.currentCategoryPath[this.props.app.currentCategoryPath.length - 1]);
    return (
      <Spin spinning={this.props.posts.loading}>
        <div className="container">
          <Helmet>
            <If condition={currentMenu}>
              <title>{`${currentMenu.category_title}分类列表_${this.props.app.setting.site_name}`}</title>
            </If>
            <If condition={this.getTitle() !== ''}>
              <title>{`${this.getTitle()}_${this.props.app.setting.site_name}`}</title>
            </If>
            <If condition={this.props.computedMatch.path === '/'}>
              <title>{`首页_${this.props.app.setting.site_name}`}</title>
            </If>
          </Helmet>
          <If condition={this.getTitle() !== ''}>
            <div className={styles.title}>{this.getTitle()}</div>
          </If>
          <Choose>
            <When condition={this.props.posts.list.length > 0}>
              <PostListItem {...this.props}/>
              <div className={styles.pagination}>
                <Pagination
                  defaultCurrent={this.props.location.query.page * 1 || 1}
                  total={this.props.posts.total}
                  pageSize={this.props.location.query.limit * 1 || 10}
                  onChange={this.onPaginationChange}
                />
              </div>
            </When>
            <Otherwise>
              <Empty description="没有找到文章"/>
            </Otherwise>
          </Choose>
        </div>
      </Spin>
    )
  }
}

export default Category;
