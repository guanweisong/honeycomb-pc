import React, { useEffect } from 'react';
import { Spin, Empty, Input, Button, Form } from 'antd';
import {
  UserOutlined,
  FolderOpenOutlined,
  TagOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  EyeOutlined,
  VideoCameraOutlined,
  CalendarOutlined,
  MailOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import moment from 'moment';
import $ from 'jquery';
import 'fancybox/dist/css/jquery.fancybox.css';
import { Helmet } from "react-helmet";
import Tags from '@/components/Tags';
import styles from './index.less';
import { Link }  from 'umi';
import Helper from '@/utils/helper';
import Mapping from '@/utils/mapping.tsx';
import { match } from 'react-router';
import useSettingModel from '@/models/setting';
import useMenuModel from '@/models/menu';
import usePostModel from '@/models/post';
import useComment from '@/models/comment';
import CommentDTO from '@/types/CommentDTO';
import MenuDTO from '@/types/MenuDTO';
import SettingDTO from '@/types/SettingDTO';
import PostDTO from '@/types/PostDTO';

require('fancybox')($);
import H from 'history';

interface Location extends H.Location {
  query: {[key: string]: string};
}

const FormItem = Form.Item;
const { TextArea } = Input;

interface PathParams {
  id: string;
}

interface ArchivesProps {
  match: match<PathParams>;
  location: Location;
}

const Archives = (props: ArchivesProps) => {

  const settingModel = useSettingModel();
  const menuModel = useMenuModel();
  const postModel = usePostModel();
  const commentModel = useComment();

  const setting: SettingDTO = settingModel.setting;
  const menu: MenuDTO[] = menuModel.menu;

  const [form] = Form.useForm();

  const postId = props.match.params.id;
  const postDetail: PostDTO = postModel.detail[postId];
  const randomPostsList: PostDTO[] = postModel.randomPostsList[postId] || [];

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
    if (postDetail) {
      postModel.indexRandomPostByCategoryId({
        post_category: postDetail.post_category._id,
        post_id: postId,
        number: 10,
      })
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
        menuModel.setCurrentCategoryPath(categoryPath);
      }
    }
  }, [postDetail]);

  /**
   * 清空评论状态
   */
  useEffect(() => {
    form.resetFields();
    handleReply(null);
  }, [commentModel.total]);

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
  }, [postModel.detail]);

  /**
   * 获取文章详情与评论的函数
   */
  const getData = () => {
    postModel.indexPostDetail(postId);
    commentModel.index(postId);
  };

  /**
   * 评论回复事件
   * @param item
   */
  const handleReply = (item) => {
    if (item !== null) {
      window.scrollTo(0 ,99999);
    }
    commentModel.setReplyTo(item || null);
  };

  /**
   * 评论提交事件
   */
  const onFinish = (result: any) => {
    console.log('result', result)
    // @ts-ignore
    let captcha = new TencentCaptcha('2090829333', (res: any) => {
      if (res.ret === 0) {
        let data = {...result};
        data = { ...data, comment_post: postDetail._id };
        if (commentModel.replyTo !== null) {
          data = { ...data, comment_parent: commentModel.replyTo._id };
        }
        console.log('handleSubmit', data);
        commentModel.create({
          ...data,
          captcha: {
            ticket: res.ticket,
            randstr: res.randstr,
          },
        })
      }
    });
    captcha && captcha.show();
  };

  /**
   * 评论列表渲染
   * @param data
   */
  const renderCommentList = (data: CommentDTO[]) => {
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
    <Spin spinning={postModel.loading}>
      <div className="container">
        {
          postDetail ? (
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
                  <li className={styles["detail__info-item"]}><UserOutlined />&nbsp;
                    <Link to={`/authors/${postDetail.post_author.user_name}`} className="link-light">{postDetail.post_author.user_name}</Link>
                  </li>
                  <li className={styles["detail__info-item"]}><FolderOpenOutlined />&nbsp;
                    <Link to={Helper.getFullCategoryPathById(postDetail.post_category._id, menu)} className="link-light">{postDetail.post_category.category_title}</Link>
                  </li>
                  <li className={styles["detail__info-item"]}><ClockCircleOutlined />&nbsp;{moment(postDetail.created_at).format('YYYY-MM-DD')}</li>
                  <li className={styles["detail__info-item"]}><MessageOutlined />&nbsp;{commentModel.total} Comments</li>
                  <li className={styles["detail__info-item"]}><EyeOutlined />&nbsp;{postDetail.post_views}&nbsp;Views</li>
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
                      {postDetail.post_type === 2 && (
                        <li className={styles["detail__extra-item"]}>
                          <VideoCameraOutlined />
                          &nbsp;
                          {moment(postDetail.gallery_time).format('YYYY-MM-DD')}
                          &nbsp;
                          拍摄于
                          &nbsp;
                          {postDetail.gallery_location}
                        </li>
                      )}
                      {postDetail.post_type === 1 && (
                        <li className={styles["detail__extra-item"]}>
                          <CalendarOutlined />
                          &nbsp;
                          上映时间：
                          {moment(postDetail.movie_time).format('YYYY-MM-DD')}
                        </li>
                      )}
                      {(postDetail.post_type === 1 || postDetail.post_type === 2) && (
                        <li className={styles["detail__extra-item"]}>
                          <TagOutlined />
                          &nbsp;
                          <Tags {...postDetail}/>
                        </li>
                      )}
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
                  commentModel.total !== 0 && (
                    <>
                      <div className={styles["block__title"]}>{commentModel.total} Comments</div>
                      <div className={styles["block__content"]}>
                        <ul className={styles["detail__comment-list"]}>
                          {renderCommentList(commentModel.list)}
                        </ul>
                      </div>
                    </>
                  )
                }
                <div className={styles["block__title"]}>Leave A Comment</div>
                <div className={styles["block__content"]}>
                  {
                    commentModel.replyTo !== null && (
                      <div className={styles["detail__comment-reply"]}>
                        <span className={styles["detail__comment-reply-label"]}>Reply to:</span>
                        <span className={styles["detail__comment-reply-name"]}>{commentModel.replyTo.comment_author}</span>
                        <span
                          className={styles["detail__comment-reply-cancel"]}
                          onClick={() => handleReply(null)}
                        >
                          [取消]
                        </span>
                      </div>
                    )
                  }
                  <Form
                    form={form}
                    onFinish={onFinish}
                  >
                    <FormItem
                      name="comment_author"
                      rules={[
                        { required: true, message: '请输入称呼' },
                        { max: 20, message: '字数不能大于20' }
                      ]}
                    >
                      <Input prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="称呼" />
                    </FormItem>
                    <FormItem
                      name="comment_email"
                      rules={[
                        { required: true, message: '请输入邮箱' },
                        { max: 30, message: '字数不能大于30' },
                        { type: 'email', message: '邮箱格式不正确'}
                      ]}
                    >
                      <Input prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="邮箱" />
                    </FormItem>
                    <FormItem
                      name="comment_content"
                      rules={[
                        { required: true, message: '请输入内容' },
                        { max: 200, message: '字数不能大于200' },
                      ]}
                    >
                      <TextArea rows={4} placeholder="我坚信，评论可以一针见血"/>
                    </FormItem>
                    <FormItem>
                      <Button
                        type="primary"
                        htmlType="submit"
                      >
                        提交
                      </Button>
                    </FormItem>
                  </Form>
                </div>
              </div>
            </>
            )
            :
            !postModel.loading ?
              <Empty description="没有找到文章"/>
              : null
        }
      </div>
    </Spin>
  )
}

export default Archives;
