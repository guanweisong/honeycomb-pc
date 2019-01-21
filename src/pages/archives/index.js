import React, { PureComponent } from 'react';
import { Spin, Empty, Icon, Form, Input, Button } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import moment from 'moment';
import { Helmet } from "react-helmet";
import Tags from '@/components/Tags';
import styles from './index.less';
import Link from "umi/link";

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
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.computedMatch.url !== this.props.computedMatch.url) {
      this.getData(nextProps.computedMatch.params.id);
    }
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'app/setMovieDetail',
      payload: {
        isMovie: false,
        background: '',
      },
    });
    this.props.dispatch({
      type: 'app/setCurrentCategoryPath',
      payload: [],
    });
  }
  getData = (id) => {
    this.props.dispatch({
      type: 'posts/indexPostDetail',
      payload: {_id: id},
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
      let data = this.props.form.getFieldsValue();
      data = { ...data, comment_post: this.props.posts.detail._id};
      if (this.props.comments.replyTo !== null) {
        data = { ...data, comment_parent: this.props.comments.replyTo._id};
      }
      console.log('handleSubmit', data);
      this.props.dispatch({
        type: 'comments/create',
        payload: {
          ...data,
          callback: () => {
            this.props.form.resetFields();
            this.handleReply(null);
          }
        },
      });
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
    const { detail } = this.props.posts;
    const { getFieldDecorator } = this.props.form;
    return (
      <Spin spinning={this.props.posts.loading}>
        <div className="container">
          <Choose>
            <When condition={detail}>
              <Helmet>
                <title>{`${detail.post_title}_${this.props.app.setting.site_name}`}</title>
              </Helmet>
              <div className={styles["detail__content"]}>
                <h1 className={styles["detail__title"]}>{detail.post_title}</h1>
                <ul className={styles["detail__info"]}>
                  <li className={styles["detail__info-item"]}><Icon type="user" />&nbsp;
                    <Link to={`/authors/${detail.post_author.user_name}`} className="link-light">{detail.post_author.user_name}</Link>
                  </li>
                  <If condition={detail.post_type === 2}>
                    <li className={styles["detail__info-item"]}><Icon type="environment" />&nbsp;{detail.gallery_location}</li>
                  </If>
                  <li className={styles["detail__info-item"]}><Icon type="clock-circle" />&nbsp;{moment(detail.created_at).format('YYYY-MM-DD')}</li>
                  <li className={styles["detail__info-item"]}><Icon type="message" />&nbsp;{this.props.comments.total} Comments</li>
                  <li className={styles["detail__info-item"]}><Icon type="eye" />&nbsp;{detail.post_views}&nbsp;Views</li>
                </ul>
                <div
                  className={classNames({
                    [styles["detail__detail"]]: true,
                    'markdown-body': true,
                  })}
                  dangerouslySetInnerHTML={{__html: detail.post_content}}
                />
                <If condition={detail.post_type === 1 || detail.post_type === 2}>
                  <div className={styles["detail__tags"]}>
                    <Icon type="tag" />&nbsp;
                    <Tags data={detail}/>
                  </div>
                </If>
              </div>
              <div className={styles["detail__comment"]}>
                <If condition={this.props.comments.total !== 0}>
                  <div className={styles["detail__comment-title"]}>
                    <span className={styles["detail__comment-title-text"]}>{this.props.comments.total} Comments</span>
                  </div>
                  <div className={styles["detail__comment-content"]}>
                    <ul className={styles["detail__comment-list"]}>
                      {this.renderCommentList(this.props.comments.list)}
                    </ul>
                  </div>
                </If>
                <div className={styles["detail__comment-title"]}>
                  <span className={styles["detail__comment-title-text"]}>Leave A Comment</span>
                </div>
                <div className={styles["detail__comment-form"]}>
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
                      <Button type="primary" onClick={this.handleSubmit}>提交</Button>
                    </FormItem>
                  </Form>
                </div>
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
