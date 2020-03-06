import React, { } from 'react';
import { Link } from 'umi';
import {
  UserOutlined,
  FolderOpenOutlined,
  TagOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  EyeOutlined
} from '@ant-design/icons';
import moment from 'moment';
import classNames from 'classnames';
import Tags from '@/components/Tags';
import Helper from '@/utils/helper';
import { useSelector } from 'react-redux';
import Mapping from '@/utils/mapping.tsx';
import styles from './index.less';
import { GlobalStoreType } from '@/types/globalStore';
import { MenuStateType } from '@/models/menu';
import { PostType } from '@/types/post';

interface PostListItemProps {
  list: PostType [];
}

const PostListItem = (props: PostListItemProps) => {

  const { menu } = useSelector<GlobalStoreType, MenuStateType>(state => state.menu);
  return (
    <>
     {props.list.map(item =>
        <div
          className={classNames({
            [styles["post-list-item"]]: true,
            [styles[Mapping.postClass[item.post_type]]]: true,
          })}
          key={item._id}
        >
          <div className={styles["post-list-item__mark"]}>
            {Mapping.postIcon[item.post_type]}
          </div>
          {item.post_cover && (
            <div
              className={styles["post-list-item__banner"]}
              style={{backgroundImage: `url(//${item.post_cover && item.post_cover.media_url_720p})`}}
            />
          )}
          <div className={styles["post-list-item__content"]}>
            <div className={styles["post-list-item__title"]}>
              {item.post_type === 1 && `${item.post_title} ${item.movie_name_en} (${moment(item.movie_time).format('YYYY')})`}
              {[0, 2].includes(item.post_type) && item.post_title}
              {item.post_type === 3 && `“${item.quote_content}” —— ${item.quote_author}`}
            </div>
            <div className={styles["post-list-item__intro"]}>
              {item.post_excerpt}
              <div className={styles["post-list-item__more"]}>
                <Link to={`/archives/${item._id}`}>查看全文</Link>
              </div>
            </div>
            <div className={styles["post-list-item__info"]}>
              <li className={styles["post-list-item__info-item"]}><UserOutlined />&nbsp;
                <Link to={`/authors/${encodeURI(item.post_author.user_name)}`} className="link-light">{item.post_author.user_name}</Link>
              </li>
              <li className={styles["post-list-item__info-item"]}><FolderOpenOutlined />&nbsp;
                <Link to={Helper.getFullCategoryPathById(item.post_category._id, menu)} className="link-light">{item.post_category.category_title}</Link>
              </li>
              {(item.post_type === 1 || item.post_type === 2) && (
                <li className={styles["post-list-item__info-item"]}>
                  <TagOutlined />&nbsp;
                  <Tags {...item}/>
                </li>
              )}
              <li className={styles["post-list-item__info-item"]}><ClockCircleOutlined />&nbsp;{moment(item.created_at).format('YYYY-MM-DD')}</li>
              <li className={styles["post-list-item__info-item"]}><MessageOutlined />&nbsp;{item.comment_count} Comments</li>
              <li className={styles["post-list-item__info-item"]}><EyeOutlined />&nbsp;{item.post_views}&nbsp;Views</li>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PostListItem;
