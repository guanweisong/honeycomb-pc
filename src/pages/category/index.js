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
    this.getData(this.props.computedMatch.params, this.props.location.query);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.computedMatch.url !== this.props.computedMatch.url || nextProps.location.search !== this.props.location.search) {
      this.getData(nextProps.computedMatch.params, nextProps.location.query);
    }
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'app/setCurrentCategoryPath',
      payload: [],
    })
  }
  getData = (params, query) => {
    if (this.props.app.menu.length === 0) {
      this.props.dispatch({
        type: 'app/indexMenu',
        payload: {},
      }).then(res => {
        this.getDataFn(params, query);
      })
    } else {
      this.getDataFn(params, query);
    }
  };
  getDataFn = (params, query) => {
    const condition = {};
    const idEn = params.secondCategory || params.firstCategory;
    if (idEn) {
      condition._id = this.props.app.menu.find((item) => item.category_title_en === idEn)._id;
    }
    this.props.dispatch({
      type: 'posts/indexPostByCategoryId',
      payload: {...condition, post_status: 0, ...query},
    });
    const path = [];
    params.firstCategory && path.push(params.firstCategory);
    params.secondCategory && path.push(params.secondCategory);
    this.props.dispatch({
      type: 'app/setCurrentCategoryPath',
      payload: path,
    })
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
              <If condition={!this.props.posts.loading}>
                <Empty description="没有找到文章"/>
              </If>
            </Otherwise>
          </Choose>
        </div>
      </Spin>
    )
  }
}

export default Category;
