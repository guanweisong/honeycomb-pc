import React, { PureComponent } from 'react';
import { Pagination } from 'antd';
import { connect } from 'dva';
import PostListItem from '@/components/PostListItem';
import styles from './index.less';

const mapStateToProps = (state) => state;

@connect(mapStateToProps)
class Home extends PureComponent {
  render() {
    return (
      <div className="container">
        <PostListItem data = {this.props.posts.list}/>
        <div className={styles.pagination}>
          <Pagination defaultCurrent={1} total={this.props.posts.total}/>
        </div>
      </div>
    )
  }
}

export default Home;
