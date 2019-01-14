import React, { PureComponent } from 'react';
import { Spin, Empty, Icon } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import styles from './index.less';

const mapStateToProps = (state) => state;

@connect(mapStateToProps)
class Archives extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.getData(this.props.computedMatch.params.id);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.computedMatch.url !== this.props.computedMatch.url) {
      this.getData(nextProps.computedMatch.params.id);
    }
  }
  getData = (id) => {
    this.props.dispatch({
      type: 'posts/indexPostDetail',
      payload: {_id: id}
    });
  };
  getTags = (arr) => {
    const textArr = [];
    arr.forEach((item) => {
      item.forEach((n) => {
        textArr.push(n.tag_name);
      });
    });
    return textArr.join('、');
  };
  render() {
    const { detail } = this.props.posts;
    return (
      <Spin spinning={this.props.posts.loading}>
        <div className="container">
          <Choose>
            <When condition={detail}>
              <div className={styles["detail__content"]}>
                <h1 className={styles["detail__title"]}>{detail.post_title}</h1>
                <ul className={styles["detail__info"]}>
                  <li className={styles["detail__info-item"]}><Icon type="user" />&nbsp;{detail.post_author.user_name}</li>
                  <li className={styles["detail__info-item"]}><Icon type="clock-circle" />&nbsp;{moment(detail.created_at).format('YYYY-MM-DD')}</li>
                  <li className={styles["detail__info-item"]}><Icon type="message" />&nbsp;10 Comments</li>
                  <li className={styles["detail__info-item"]}><Icon type="eye" />&nbsp;{detail.post_views}&nbsp;Views</li>
                </ul>
                <div className={styles["detail__detail"]}>{detail.post_content}</div>
                <If condition={detail.post_type === 1 || detail.post_type === 2}>
                  <div className={styles["detail__tags"]}>
                    <Icon type="tag" />&nbsp;
                    <If condition={detail.post_type === 1}>
                      {this.getTags([detail.movie_director, detail.movie_actor, detail.movie_style])}
                    </If>
                    <If condition={detail.post_type === 2}>
                      {this.getTags([detail.gallery_style])}
                    </If>
                  </div>
                </If>
              </div>
              <div className={styles["detail__comment"]}>
                <div className={styles["detail__comment-title"]}>
                  <span className={styles["detail__comment-title-text"]}>32 Comments</span>
                  <span className={styles["detail__comment-title-button"]}><Icon type="edit" />&nbsp;Leave a comment now</span>
                </div>
                <ul className={styles["detail__comment-list"]}>
                  <li className={styles["detail__comment-item"]}>
                    <div className={styles["detail__comment-photo"]}></div>
                    <div className={styles["detail__comment-content"]}>
                      <div className={styles["detail__comment-name"]}>John Doe</div>
                      <div className={styles["detail__comment-text"]}>Good, Good, Good, Good, Good, Good, Good, Good, Good, Good, Good, Good, Good, Good, Good, Good, Good, Good, Good, Good, Good, Good, Good, Good, Good, Good, Good, </div>
                    </div>
                    <ul className={styles["detail__comment-info"]}>
                      <li className={styles["detail__comment-info-item"]}>2018-10-10</li>
                      <li className={styles["detail__comment-info-item"]}>Reply</li>
                    </ul>
                  </li>
                </ul>
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

export default Archives;
