import React, { PureComponent } from 'react';
import { Spin, Empty, Icon, Form, Input, Button } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import moment from 'moment';
import $ from 'jquery';
import 'fancybox/dist/css/jquery.fancybox.css';
import { Helmet } from "react-helmet";
import Tags from '@/components/Tags';
import styles from './index.less';
import Link from "umi/link";
import { getFullCategoryPathById } from '@/utils/help';
import { postClass } from '@/utils/mapping';
require('fancybox')($);

const FormItem = Form.Item;
const { TextArea } = Input;

const mapStateToProps = (state) => state;

@connect(mapStateToProps)
@Form.create()
class Archives extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.getData(this.props.computedMatch.params.id);
    this.captcha = new TencentCaptcha('2090829333', (res) => {
      if (res.ret === 0) {
        let data = this.props.form.getFieldsValue();
        data = { ...data, comment_post: this.props.posts.detail._id};
        if (this.props.comments.replyTo !== null) {
          data = { ...data, comment_parent: this.props.comments.replyTo._id };
        }
        console.log('handleSubmit', data);
        this.props.dispatch({
          type: 'comments/create',
          payload: {
            ...data,
            captcha: {
              ticket: res.ticket,
              randstr: res.randstr
            },
            callback: () => {
              this.props.form.resetFields();
              this.handleReply(null);
            }
          },
        });
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.computedMatch.url !== this.props.computedMatch.url) {
      this.getData(nextProps.computedMatch.params.id);
    }
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'app/setCurrentCategoryPath',
      payload: [],
    });
    this.props.dispatch({
      type: 'posts/saveDetailData',
      payload: null,
    });
    this.props.dispatch({
      type: 'posts/saveRandomPostsListData',
      payload: [],
    });
    this.props.dispatch({
      type: 'comments/saveListData',
      payload: {
        list: [],
        total: 0,
      },
    })
  }
  getData = (id) => {
    this.props.dispatch({
      type: 'posts/indexPostDetail',
      payload: {
        _id: id,
        callback: ()=> {
          $('.markdown-body img').each((index, item) => {
            $(item).wrap(`<a href=${$(item).attr('src')} rel='gallery'></a>`);
          });
          $('.markdown-body [rel=gallery]').fancybox();
          this.props.dispatch({
            type: 'posts/indexRandomPostByCategoryId',
            payload: {
              post_category: this.props.posts.detail.post_category._id,
              number: 10,
            },
          });
        }
      },
    });
    this.props.dispatch({
      type: 'comments/index',
      payload: id,
    });
  };
  handleReply = (item) => {
    if (item !== null) {
      window.scrollTo(0 ,99999);
    }
    this.props.dispatch({
      type: 'comments/setReplyTo',
      payload: item,
    });
  };
  handleSubmit = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return;
      }
      this.captcha.show();
    });
  };
  renderCommentList = (data) => {
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
                <Choose>
                  <When condition={item.comment_status !== 3}>
                    {item.comment_content}
                  </When>
                  <Otherwise>
                    该条评论已屏蔽
                  </Otherwise>
                </Choose>
              </div>
            </div>
            <ul className={styles["detail__comment-info"]}>
              <li className={styles["detail__comment-info-item"]}>{moment(item.created_at).format('YYYY-MM-DD')}</li>
              <li
                className={classNames({
                  [styles["detail__comment-info-item"]]: true,
                  [styles["detail__comment-info-item--reply"]]: true,
                })}
                onClick={() => this.handleReply(item)}
              >
                Reply
              </li>
            </ul>
          </div>
          <If condition={item.children.length > 0}>
            <ul className={styles["detail__comment-list"]}>
              {this.renderCommentList(item.children)}
            </ul>
          </If>
        </li>
      )
    })
  };
  render() {
    const { detail, randomPostsList } = this.props.posts;
    const { getFieldDecorator } = this.props.form;
    return (
      <Spin spinning={this.props.posts.loading}>
        <div className="container">
          <Choose>
            <When condition={detail}>
              <Helmet>
                <title>{`${detail.post_title || detail.quote_content}_${this.props.app.setting.site_name}`}</title>
              </Helmet>
              <div className={styles["detail__content"]}
                   className={classNames({
                     [styles["detail__content"]]: true,
                     [styles[postClass[detail.post_type]]]: true,
                   })}
              >
                <h1 className={styles["detail__title"]}>
                  <If condition={detail.post_type === 1}>
                    {detial.post_title} {detail.movie_name_en} ({moment(detail.movie_time).format('YYYY')})
                  </If>
                  <If condition={[0, 2].includes(detail.post_type)}>
                    {detail.post_title}
                  </If>
                  <If condition={detail.post_type === 3}>
                    “{detail.quote_content}” —— {detail.quote_author}
                  </If>
                </h1>
                <ul className={styles["detail__info"]}>
                  <li className={styles["detail__info-item"]}><Icon type="user" />&nbsp;
                    <Link to={`/authors/${detail.post_author.user_name}`} className="link-light">{detail.post_author.user_name}</Link>
                  </li>
                  <li className={styles["detail__info-item"]}><Icon type="folder-open" />&nbsp;
                    <Link to={getFullCategoryPathById(detail.post_category._id, this.props.app.menu)} className="link-light">{detail.post_category.category_title}</Link>
                  </li>
                  <li className={styles["detail__info-item"]}><Icon type="clock-circle" />&nbsp;{moment(detail.created_at).format('YYYY-MM-DD')}</li>
                  <li className={styles["detail__info-item"]}><Icon type="message" />&nbsp;{this.props.comments.total} Comments</li>
                  <li className={styles["detail__info-item"]}><Icon type="eye" />&nbsp;{detail.post_views}&nbsp;Views</li>
                </ul>
                <If condition={detail.post_type !== 3}>
                  <div
                    className={classNames({
                      [styles["detail__detail"]]: true,
                      'markdown-body': true,
                    })}
                    dangerouslySetInnerHTML={{__html: detail.post_content}}
                  />
                  <ul className={styles["detail__extra"]}>
                    <If condition={detail.post_type === 2}>
                      <li className={styles["detail__extra-item"]}><Icon type="camera" />&nbsp;{moment(detail.gallery_time).format('YYYY-MM-DD')}&nbsp;拍摄于&nbsp;{detail.gallery_location}</li>
                    </If>
                    <If condition={detail.post_type === 1}>
                      <li className={styles["detail__extra-item"]}><Icon type="calendar" />&nbsp;上映时间：{moment(detail.movie_time).format('YYYY-MM-DD')}</li>
                    </If>
                    <If condition={detail.post_type === 1 || detail.post_type === 2}>
                      <li className={styles["detail__extra-item"]}><Icon type="tag" />&nbsp;<Tags data={detail}/></li>
                    </If>
                  </ul>
                </If>
              </div>
              <If condition={randomPostsList.length > 0}>
                <div className={styles["block"]}>
                  <div className={styles["block__title"]}>猜你喜欢</div>
                  <div className={styles["block__content"]}>
                    <ul className={styles["detail__post-list"]}>
                      <For each="item" index="index" of={randomPostsList}>
                        <li key={index}>
                          <Link to={`/archives/${item._id}`}>
                            {item.post_title || item.quote_content}
                          </Link>
                        </li>
                      </For>
                    </ul>
                  </div>
                </div>
              </If>
              <div className={classNames({
                  [styles["detail__comment"]]: true,
                  [styles["block"]]: true,
                })}
              >
                <If condition={this.props.comments.total !== 0}>
                  <div className={styles["block__title"]}>{this.props.comments.total} Comments</div>
                  <div className={styles["block__content"]}>
                    <ul className={styles["detail__comment-list"]}>
                      {this.renderCommentList(this.props.comments.list)}
                    </ul>
                  </div>
                </If>
                <div className={styles["block__title"]}>Leave A Comment</div>
                <div className={styles["block__content"]}>
                  <If condition={this.props.comments.replyTo !== null}>
                    <div className={styles["detail__comment-reply"]}>
                      <span className={styles["detail__comment-reply-label"]}>Reply to:</span>
                      <span className={styles["detail__comment-reply-name"]}>{this.props.comments.replyTo.comment_author}</span>
                      <span
                        className={styles["detail__comment-reply-cancel"]}
                        onClick={() => this.handleReply(null)}
                      >
                        [取消]
                      </span>
                    </div>
                  </If>
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
                        onClick={this.handleSubmit}
                      >
                        提交
                      </Button>
                    </FormItem>
                  </Form>
                </div>
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

export default Archives;
