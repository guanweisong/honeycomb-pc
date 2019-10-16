import React, { PureComponent } from 'react';
import Link from 'umi/link';
import { Icon } from 'antd';
import moment from 'moment';
import classNames from 'classnames';
import Tags from '@/components/Tags';
import { getFullCategoryPathById } from '@/utils/help';
import { postClass, postIcon} from '@/utils/mapping';
import styles from './index.less';

class PostListItem extends PureComponent {
  render () {
    return (
      <For each="item" index="index" of={this.props.posts.list}>
        <div
          className={classNames({
            [styles["post-list-item"]]: true,
            [styles[postClass[item.post_type]]]: true,
          })}
          key={index}
        >
          <div className={styles["post-list-item__mark"]}><Icon type={postIcon[item.post_type]} /></div>
          <If condition={item.post_cover}>
            <div
              className={styles["post-list-item__banner"]}
              style={{backgroundImage: `url(//${item.post_cover.media_url_720p})`}}
            />
          </If>
          <div className={styles["post-list-item__content"]}>
            <div className={styles["post-list-item__title"]}>
              <If condition={item.post_type === 1}>
                {item.post_title} {item.movie_name_en} ({moment(item.movie_time).format('YYYY')})
              </If>
              <If condition={[0, 2].includes(item.post_type)}>
                {item.post_title}
              </If>
              <If condition={item.post_type === 3}>
                “{item.quote_content}” —— {item.quote_author}
              </If>
            </div>
            <div className={styles["post-list-item__intro"]}>
              {item.post_excerpt}
              <div className={styles["post-list-item__more"]}>
                <Link to={`/archives/${item._id}`}>查看全文</Link>
              </div>
            </div>
            <div className={styles["post-list-item__info"]}>
              <li className={styles["post-list-item__info-item"]}><Icon type="user" />&nbsp;
                <Link to={`/authors/${encodeURI(item.post_author.user_name)}`} className="link-light">{item.post_author.user_name}</Link>
              </li>
              <li className={styles["post-list-item__info-item"]}><Icon type="folder-open" />&nbsp;
                <Link to={getFullCategoryPathById(item.post_category._id, this.props.app.menu)} className="link-light">{item.post_category.category_title}</Link>
              </li>
              <If condition={item.post_type === 1 || item.post_type === 2}>
                <li className={styles["post-list-item__info-item"]}>
                  <Icon type="tag" />&nbsp;
                  <Tags data={item}/>
                </li>
              </If>
              <li className={styles["post-list-item__info-item"]}><Icon type="clock-circle" />&nbsp;{moment(item.created_at).format('YYYY-MM-DD')}</li>
              <li className={styles["post-list-item__info-item"]}><Icon type="message" />&nbsp;{item.comment_count} Comments</li>
              <li className={styles["post-list-item__info-item"]}><Icon type="eye" />&nbsp;{item.post_views}&nbsp;Views</li>
            </div>
          </div>
        </div>
      </For>
    )
  }
}

export default PostListItem;
