import React, { PureComponent } from 'react';
import { Pagination, Spin, Empty } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PostListItem from '@/components/PostListItem';
import styles from './index.less';

const mapStateToProps = (state) => state;

@connect(mapStateToProps)
class Category extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.getData(this.props.computedMatch.params.firstCategory, this.props.computedMatch.params.secondCategory);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.computedMatch.url !== this.props.computedMatch.url || nextProps.location.search !== this.props.location.search) {
      const firstCategory = nextProps.computedMatch.params.firstCategory;
      const secondCategory = nextProps.computedMatch.params.secondCategory;
      this.getData(firstCategory, secondCategory);
    }
  }
  getData = (firstCategory, secondCategory) => {
    const params = {};
    if (!secondCategory && firstCategory) {
      const parentId = this.props.app.menu.find((item) => item.category_title_en === firstCategory)._id;
      const ids = [];
      this.props.app.menu.forEach((item) => {
        if (item.category_parent === parentId) {
          ids.push(item._id);
        }
      });
      params.post_category = (ids.length ? ids : parentId);
    } else if (secondCategory) {
      params.post_category = this.props.app.menu.find((item) => item.category_title_en === secondCategory)._id;
    }
    this.props.dispatch({
      type: 'posts/indexPostList',
      payload: {...params, ...this.props.location.query},
    });
  };
  onPaginationChange = (page, pageSize) => {
    this.props.dispatch(
      routerRedux.push({
        query: {...this.props.location.query, page: page, limit: pageSize}
      })

    );
  };
  render() {
    return (
      <Spin spinning={this.props.posts.loading}>
        <div className="container">
          <Choose>
            <When condition={this.props.posts.list.length > 0}>
              <PostListItem data={this.props.posts.list}/>
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
