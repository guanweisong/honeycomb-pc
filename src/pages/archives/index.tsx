import React, { useEffect } from 'react';
import { Spin, Empty, Icon, Form, Input, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form.d';
import classNames from 'classnames';
import moment from 'moment';
import $ from 'jquery';
import 'fancybox/dist/css/jquery.fancybox.css';
import { Helmet } from "react-helmet";
import Tags from '@/components/Tags';
import styles from './index.less';
import Link from "umi/link";
import Helper from '@/utils/helper';
import Mapping from '@/utils/mapping';
import { match, withRouter } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { SettingStateType } from '@/models/setting';
import { PostStateType } from '@/models/post';
import { MenuStateType } from '@/models/menu';
import { CommentStateType, ReplyToType } from '@/models/comment';
import { CommentType } from '@/types/comment';
import { GlobalStoreType } from '@/types/globalStore';
import { AnyAction, Dispatch } from 'redux';
require('fancybox')($);
import H from 'history';
import { PostType } from '@/types/post';

interface Location extends H.Location {
  query: {[key: string]: string};
}

const FormItem = Form.Item;
const { TextArea } = Input;

interface PathParams {
  id: string;
}

interface ArchivesProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  computedMatch: match<PathParams>;
  location: Location;
}


const Archives = (props: ArchivesProps) => {

  const { setting } = useSelector<GlobalStoreType, SettingStateType>(state => state.setting);
  const { menu } = useSelector<GlobalStoreType, MenuStateType>(state => state.menu);
  const post = useSelector<GlobalStoreType, PostStateType>(state => state.post);
  const comment = useSelector<GlobalStoreType, CommentStateType>(state => state.comment);

  const dispatch = useDispatch();
  const postId = props.computedMatch.params.id;
  const postDetail: PostType = post.detail[postId];
  const randomPostsList: PostType[] = post.randomPostsList[postId] || [];
  const { getFieldDecorator } = props.form;

  /**
   * 获取文章数据
   */
  useEffect(() => {
    if (menu.length > 0 && !postDetail) {
      getData();
    }
  }, [props.location.pathname, menu]);

  /**
   * 获取随机文章数据
   */
  useEffect(() => {
    if (!randomPostsList && postDetail) {
      dispatch({
        type: 'post/indexRandomPostByCategoryId',
        payload: {
          post_category: postDetail.post_category._id,
          post_id: postId,
          number: 10,
        },
      });
    }
  }, [postDetail]);

  /**
   * 设置菜单高亮
   */
  useEffect(() => {
    if (postDetail) {
      const thisCategory = menu.find(item => item._id === postDetail.post_category._id);
      if (thisCategory) {
        const parentCategory = menu.filter(item => item._id === thisCategory.category_parent);
        const categoryPath = parentCategory.length > 0 ? [parentCategory[0].category_title_en, thisCategory.category_title_en] : [thisCategory.category_title_en];
        dispatch({
          type: 'menu/setCurrentCategoryPath',
          payload: categoryPath,
        });
      }
    }
  }, [postDetail]);

  /**
   * 清空评论状态
   */
  useEffect(() => {
    props.form.resetFields();
    handleReply();
  }, [comment.total]);

  /**
   * 绑定文章详情页图片相册共嗯
   */
  useEffect(() => {
    if (postDetail) {
      $('.markdown-body img').each((index, item) => {
        $(item).wrap(`<a href=${$(item).attr('src')} rel='gallery'></a>`);
      });
      $('.markdown-body [rel=gallery]').fancybox();
    }
  }, [post.detail]);

  /**
   * 获取文章详情与评论的函数
   */
  const getData = () => {
    dispatch({
      type: 'post/indexPostDetail',
      payload: postId,
    });
    dispatch({
      type: 'comment/index',
      payload: postId,
    });
  };

  /**
   * 评论回复事件
   * @param item
   */
  const handleReply = (item?: ReplyToType) => {
    if (item !== null) {
      window.scrollTo(0 ,99999);
    }
    dispatch({
      type: 'comment/setReplyTo',
      payload: item || null,
    });
  };

  /**
   * 评论提交事件
   */
  const handleSubmit = () => {
    props.form.validateFields((errors: unknown) => {
      if (errors) {
        return;
      }
      // @ts-ignore
      let captcha = new TencentCaptcha('2090829333', (res: any) => {
        if (res.ret === 0) {
          let data = props.form.getFieldsValue();
          data = { ...data, comment_post: postDetail._id };
          if (comment.replyTo !== null) {
            data = { ...data, comment_parent: comment.replyTo._id };
          }
          console.log('handleSubmit', data);
          dispatch({
            type: 'comment/create',
            payload: {
              ...data,
              captcha: {
                ticket: res.ticket,
                randstr: res.randstr,
              },
            },
          });
        }
      });
      captcha && captcha.show();
    });
  };

  /**
   * 评论列表渲染
   * @param data
   */
  const renderCommentList = (data: CommentType[]) => {
    return data.map(item => {
      return (
        <li className={styles["detail__comment-item"]} key={item._id}>
          <div className={styles["detail__comment-wrap"]}>
            <div className={styles["detail__comment-photo"]}>
              <img src={item.comment_avatar}/>
            </div>
            <div className={styles["detail__comment-content"]}>
              <div className={styles["detail__comment-name"]}>{item.comment_author}</div>
              <div className={styles["detail__comment-text"]}>
                {
                  item.comment_status !== 3 ?
                    item.comment_content
                    :
                    '该条评论已屏蔽'
                }
              </div>
            </div>
            <ul className={styles["detail__comment-info"]}>
              <li className={styles["detail__comment-info-item"]}>{moment(item.created_at).format('YYYY-MM-DD')}</li>
              <li
                className={classNames({
                  [styles["detail__comment-info-item"]]: true,
                  [styles["detail__comment-info-item--reply"]]: true,
                })}
                onClick={() => handleReply(item)}
              >
                Reply
              </li>
            </ul>
          </div>
          {
            item.children.length > 0 && (
              <ul className={styles["detail__comment-list"]}>
                {renderCommentList(item.children)}
              </ul>
            )
          }
        </li>
      )
    })
  };

  return (
    <Spin spinning={post.loading}>
      <div className="container">
        {
          postDetail ?
            <>
              <Helmet>
                <title>{`${postDetail.post_title || postDetail.quote_content}_${setting.site_name}`}</title>
              </Helmet>
              <div
                className={
                  classNames({
                     [styles["detail__content"]]: true,
                     [styles[Mapping.postClass[postDetail.post_type]]]: true,
                   })
                }
              >
                <h1 className={styles["detail__title"]}>
                  {postDetail.post_type === 1 && `${postDetail.post_title} ${postDetail.movie_name_en} (${moment(postDetail.movie_time).format('YYYY')})`}
                  {[0, 2].includes(postDetail.post_type) && postDetail.post_title}
                  {postDetail.post_type === 3 && `“${postDetail.quote_content}” —— ${postDetail.quote_author}`}
                </h1>
                <ul className={styles["detail__info"]}>
                  <li className={styles["detail__info-item"]}><Icon type="user" />&nbsp;
                    <Link to={`/authors/${postDetail.post_author.user_name}`} className="link-light">{postDetail.post_author.user_name}</Link>
                  </li>
                  <li className={styles["detail__info-item"]}><Icon type="folder-open" />&nbsp;
                    <Link to={Helper.getFullCategoryPathById(postDetail.post_category._id, menu)} className="link-light">{postDetail.post_category.category_title}</Link>
                  </li>
                  <li className={styles["detail__info-item"]}><Icon type="clock-circle" />&nbsp;{moment(postDetail.created_at).format('YYYY-MM-DD')}</li>
                  <li className={styles["detail__info-item"]}><Icon type="message" />&nbsp;{comment.total} Comments</li>
                  <li className={styles["detail__info-item"]}><Icon type="eye" />&nbsp;{postDetail.post_views}&nbsp;Views</li>
                </ul>
                {postDetail.post_type !== 3 && (
                  <>
                    <div
                      className={classNames({
                        [styles["detail__detail"]]: true,
                        'markdown-body': true,
                      })}
                      dangerouslySetInnerHTML={{__html: postDetail.post_content || ''}}
                    />
                    <ul className={styles["detail__extra"]}>
                      {postDetail.post_type === 2 &&
                        <li className={styles["detail__extra-item"]}>
                          <Icon type="camera" />
                          &nbsp;
                          {moment(postDetail.gallery_time).format('YYYY-MM-DD')}
                          &nbsp;
                          拍摄于
                          &nbsp;
                          {postDetail.gallery_location}
                        </li>}
                      {postDetail.post_type === 1 &&
                        <li className={styles["detail__extra-item"]}>
                          <Icon type="calendar" />
                          &nbsp;
                          上映时间：
                          {moment(postDetail.movie_time).format('YYYY-MM-DD')}
                        </li>}
                      {(postDetail.post_type === 1 || postDetail.post_type === 2) &&
                        <li className={styles["detail__extra-item"]}>
                          <Icon type="tag" />
                          &nbsp;
                          <Tags {...postDetail}/>
                        </li>}
                    </ul>
                  </>
                )}
              </div>
              {randomPostsList.length > 0 && (
                <div className={styles["block"]}>
                  <div className={styles["block__title"]}>猜你喜欢</div>
                  <div className={styles["block__content"]}>
                    <ul className={styles["detail__post-list"]}>
                      {
                        randomPostsList.map(item => {
                          return (
                            <li key={item._id}>
                              <Link to={`/archives/${item._id}`}>
                                {item.post_title || item.quote_content}
                              </Link>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </div>
                </div>
              )}
              <div
                className={classNames({
                  [styles["detail__comment"]]: true,
                  [styles["block"]]: true,
                })}
              >
                {
                  comment.total !== 0 && (
                    <>
                      <div className={styles["block__title"]}>{comment.total} Comments</div>
                      <div className={styles["block__content"]}>
                        <ul className={styles["detail__comment-list"]}>
                          {renderCommentList(comment.list)}
                        </ul>
                      </div>
                    </>
                  )
                }
                <div className={styles["block__title"]}>Leave A Comment</div>
                <div className={styles["block__content"]}>
                  {
                    comment.replyTo !== null && (
                      <div className={styles["detail__comment-reply"]}>
                        <span className={styles["detail__comment-reply-label"]}>Reply to:</span>
                        <span className={styles["detail__comment-reply-name"]}>{comment.replyTo.comment_author}</span>
                        <span
                          className={styles["detail__comment-reply-cancel"]}
                          onClick={() => handleReply()}
                        >
                          [取消]
                        </span>
                      </div>
                    )
                  }
                  <Form>
                    <FormItem>
                      {getFieldDecorator('comment_author', {
                        rules: [
                          { required: true, message: '请输入称呼' },
                          { max: 20, message: '字数不能大于20' }
                        ],
                      })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="称呼" />
                      )}
                    </FormItem>
                    <FormItem>
                      {getFieldDecorator('comment_email', {
                        rules: [
                          { required: true, message: '请输入邮箱' },
                          { max: 30, message: '字数不能大于30' },
                          { type: 'email', message: '邮箱格式不正确'}
                        ],
                      })(
                        <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="邮箱" />
                      )}
                    </FormItem>
                    <FormItem>
                      {getFieldDecorator('comment_content', {
                        rules: [
                          { required: true, message: '请输入内容' },
                          { max: 200, message: '字数不能大于200' },
                        ],
                      })(
                        <TextArea rows={4} placeholder="我坚信，评论可以一针见血"/>
                      )}
                    </FormItem>
                    <FormItem>
                      <Button
                        type="primary"
                        onClick={handleSubmit}
                      >
                        提交
                      </Button>
                    </FormItem>
                  </Form>
                </div>
              </div>
            </>
            :
            !post.loading ?
              <Empty description="没有找到文章"/>
              : null
        }
      </div>
    </Spin>
  )
}

// @ts-ignore
export default withRouter(Form.create({})(Archives));
