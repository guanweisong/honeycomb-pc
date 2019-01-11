import React, { PureComponent } from 'react';
import Link from 'umi/link';
import { Icon } from 'antd';
import moment from 'moment';
import classNames from 'classnames';
import styles from './index.less';

class PostListItem extends PureComponent {
  constructor(props) {
    super(props);
    this.mapping = {
      wrapClass: {
        0: 'post',
        1: 'movie',
        2: 'gallery',
      },
      icon: {
        0: 'file-text',
        1: 'video-camera',
        2: 'picture',
      }
    };
  }
  getTags = (arr) => {
    const textArr = [];
    arr.forEach((item) => {
      item.forEach((n) => {
        textArr.push(n.tag_name);
      });
    });
    return textArr.join('、');
  };
  render () {
    console.log(this.props.data);
    return (
      <For each="item" index="index" of={this.props.data}>
        <div
          className={classNames({
            [styles["post-list-item"]]: true,
            [styles[this.mapping.wrapClass[item.post_type]]]: true,
          })}
          key={index}
        >
          <div className={styles["post-list-item__mark"]}><Icon type={this.mapping.icon[item.post_type]} /></div>
          <div
            className={styles["post-list-item__banner"]}
            style={{backgroundImage: `url(//${item.post_cover.media_url})`}}
          />
          <div className={styles["post-list-item__content"]}>
            <div className={styles["post-list-item__title"]}>{item.post_title}</div>
            <If condition={item.post_type !== 2}>
            <div className={styles["post-list-item__intro"]}>
              {item.post_content}
              <div className={styles["post-list-item__more"]}><Link to='/'>查看全文</Link></div>
            </div>
            </If>
            <div className={styles["post-list-item__info"]}>
              <li className={styles["post-list-item__info-item"]}><Icon type="user" />&nbsp;{item.post_author.user_name}</li>
              <li className={styles["post-list-item__info-item"]}><Icon type="folder-open" />&nbsp;{item.post_category.category_title}</li>
              <If condition={item.post_type === 1 || item.post_type === 2}>
                <li className={styles["post-list-item__info-item"]}>
                  <Icon type="tag" />&nbsp;
                  <If condition={item.post_type === 1}>
                    {this.getTags([item.movie_director, item.movie_actor, item.movie_style])}
                  </If>
                  <If condition={item.post_type === 2}>
                    {this.getTags([item.gallery_style])}
                  </If>
                </li>
              </If>
              <li className={styles["post-list-item__info-item"]}><Icon type="clock-circle" />&nbsp;{moment(item.created_at).format('YYYY-MM-DD')}</li>
              <li className={styles["post-list-item__info-item"]}><Icon type="message" />&nbsp;10 Comments</li>
              <li className={styles["post-list-item__info-item"]}><Icon type="eye" />&nbsp;{item.post_views}&nbsp;Views</li>
            </div>
          </div>
        </div>
      </For>
    )
  }
}

export default PostListItem;
