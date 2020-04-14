import React, { useEffect } from 'react'
import { Spin, Empty, Input, Button, Form } from 'antd'
import {
  UserOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  EyeOutlined,
  MailOutlined,
} from '@ant-design/icons'
import classNames from 'classnames'
import moment from 'moment'
import $ from 'jquery'
import 'fancybox/dist/css/jquery.fancybox.css'
import { Helmet } from 'react-helmet'
import { match } from 'react-router'
import useSettingModel from '@/models/setting'
import useMenuModel from '@/models/menu'
import usePageModel from '@/models/page'
import useComment from '@/models/comment'
import CommentDTO from '@/types/CommentDTO'
import MenuDTO from '@/types/MenuDTO'
import PageDTO from '@/types/PageDTO'
// eslint-disable-next-line import/no-extraneous-dependencies
import H from 'history'
import styles from './index.less'

require('fancybox')($)

interface Location extends H.Location {
  query: { [key: string]: string }
}

const FormItem = Form.Item
const { TextArea } = Input

interface PathParams {
  id: string
}

interface PagesProps {
  match: match<PathParams>
  location: Location
}

const Pages = (props: PagesProps) => {
  const settingModel = useSettingModel()
  const menuModel = useMenuModel()
  const pageModel = usePageModel()
  const commentModel = useComment()

  const { setting } = settingModel
  const { menu } = menuModel

  const [form] = Form.useForm()

  const pageId = props.match.params.id
  const pageDetail: PageDTO = pageModel.detail[pageId]

  /**
   * 获取文章详情与评论的函数
   */
  const getData = () => {
    pageModel.indexPageDetail(pageId)
    commentModel.index(pageId)
  }

  /**
   * 获取文章数据
   */
  useEffect(() => {
    if (menu.length > 0 && !pageDetail) {
      getData()
    }
  }, [props.location.pathname, menu])

  /**
   * 设置菜单高亮
   */
  useEffect(() => {
    if (pageDetail) {
      menuModel.setCurrentMenuPath([pageDetail._id])
    }
  }, [pageDetail])

  /**
   * 绑定文章详情页图片相册共嗯
   */
  useEffect(() => {
    if (pageDetail) {
      $('.markdown-body img').each((index, item) => {
        $(item).wrap(`<a href=${$(item).attr('src')} rel='gallery'></a>`)
      })
      $('.markdown-body [rel=gallery]').fancybox()
    }
  }, [pageDetail])

  /**
   * 评论回复事件
   * @param item
   */
  const handleReply = (item: any) => {
    if (item !== null) {
      window.scrollTo(0, 99999)
    }
    commentModel.setReplyTo(item || null)
  }

  /**
   * 清空评论状态
   */
  useEffect(() => {
    form.resetFields()
    handleReply(null)
  }, [commentModel.total])

  /**
   * 评论提交事件
   */
  const onFinish = (result: any) => {
    console.log('result', result)
    // @ts-ignore
    const captcha = new TencentCaptcha('2090829333', (res: any) => {
      if (res.ret === 0) {
        let data = { ...result }
        data = { ...data, comment_post: pageDetail._id }
        if (commentModel.replyTo !== null) {
          data = { ...data, comment_parent: commentModel.replyTo._id }
        }
        console.log('handleSubmit', data)
        commentModel.create({
          ...data,
          captcha: {
            ticket: res.ticket,
            randstr: res.randstr,
          },
        })
      }
    })
    captcha && captcha.show()
  }

  /**
   * 评论列表渲染
   * @param data
   */
  const renderCommentList = (data: CommentDTO[]) => {
    return data.map((item) => {
      return (
        <li className={styles['detail__comment-item']} key={item._id}>
          <div className={styles['detail__comment-wrap']}>
            <div className={styles['detail__comment-photo']}>
              <img alt="" src={item.comment_avatar} />
            </div>
            <div className={styles['detail__comment-content']}>
              <div className={styles['detail__comment-name']}>{item.comment_author}</div>
              <div className={styles['detail__comment-text']}>
                {item.comment_status !== 3 ? item.comment_content : '该条评论已屏蔽'}
              </div>
            </div>
            <ul className={styles['detail__comment-info']}>
              <li className={styles['detail__comment-info-item']}>
                {moment(item.created_at).format('YYYY-MM-DD')}
              </li>
              <li
                className={classNames({
                  [styles['detail__comment-info-item']]: true,
                  [styles['detail__comment-info-item--reply']]: true,
                })}
                onClick={() => handleReply(item)}
              >
                Reply
              </li>
            </ul>
          </div>
          {item.children.length > 0 && (
            <ul className={styles['detail__comment-list']}>{renderCommentList(item.children)}</ul>
          )}
        </li>
      )
    })
  }

  return (
    <Spin spinning={pageModel.loading}>
      <div className="container">
        {pageDetail ? (
          <>
            <Helmet>
              <title>{`${pageDetail.page_title}_${setting.site_name}`}</title>
            </Helmet>
            <div
              className={classNames({
                [styles.detail__content]: true,
              })}
            >
              <h1 className={styles.detail__title}>{pageDetail.page_title}</h1>
              <ul className={styles.detail__info}>
                <li className={styles['detail__info-item']}>
                  <ClockCircleOutlined />
                  &nbsp;{moment(pageDetail.created_at).format('YYYY-MM-DD')}
                </li>
                <li className={styles['detail__info-item']}>
                  <MessageOutlined />
                  &nbsp;{commentModel.total} Comments
                </li>
                <li className={styles['detail__info-item']}>
                  <EyeOutlined />
                  &nbsp;{pageDetail.page_views}&nbsp;Views
                </li>
              </ul>
              <div
                className={classNames({
                  [styles.detail__detail]: true,
                  'markdown-body': true,
                })}
                dangerouslySetInnerHTML={{ __html: pageDetail.page_content || '' }}
              />
            </div>
            <div
              className={classNames({
                [styles.detail__comment]: true,
                [styles.block]: true,
              })}
            >
              {commentModel.total !== 0 && (
                <>
                  <div className={styles.block__title}>{commentModel.total} Comments</div>
                  <div className={styles.block__content}>
                    <ul className={styles['detail__comment-list']}>
                      {renderCommentList(commentModel.list)}
                    </ul>
                  </div>
                </>
              )}
              <div className={styles.block__title}>Leave A Comment</div>
              <div className={styles.block__content}>
                {commentModel.replyTo !== null && (
                  <div className={styles['detail__comment-reply']}>
                    <span className={styles['detail__comment-reply-label']}>Reply to:</span>
                    <span className={styles['detail__comment-reply-name']}>
                      {commentModel.replyTo.comment_author}
                    </span>
                    <span
                      className={styles['detail__comment-reply-cancel']}
                      onClick={() => handleReply(null)}
                    >
                      [取消]
                    </span>
                  </div>
                )}
                <Form form={form} onFinish={onFinish}>
                  <FormItem
                    name="comment_author"
                    rules={[
                      { required: true, message: '请输入称呼' },
                      { max: 20, message: '字数不能大于20' },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="称呼"
                    />
                  </FormItem>
                  <FormItem
                    name="comment_email"
                    rules={[
                      { required: true, message: '请输入邮箱' },
                      { max: 30, message: '字数不能大于30' },
                      { type: 'email', message: '邮箱格式不正确' },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="邮箱"
                    />
                  </FormItem>
                  <FormItem
                    name="comment_content"
                    rules={[
                      { required: true, message: '请输入内容' },
                      { max: 200, message: '字数不能大于200' },
                    ]}
                  >
                    <TextArea rows={4} placeholder="我坚信，评论可以一针见血" />
                  </FormItem>
                  <FormItem>
                    <Button type="primary" htmlType="submit">
                      提交
                    </Button>
                  </FormItem>
                </Form>
              </div>
            </div>
          </>
        ) : !pageModel.loading ? (
          <Empty description="没有找到文章" />
        ) : null}
      </div>
    </Spin>
  )
}

export default Pages
