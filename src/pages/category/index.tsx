import React, { useEffect } from 'react'
import { Pagination, Spin, Empty } from 'antd'
// @ts-ignore
import { history } from 'umi'
import { Helmet } from 'react-helmet'
import { match } from 'react-router'
import PostListItem from '@/components/PostListItem'
import { IndexPostListParamsType } from '@/resquests/PostResquest'
import useSettingModel from '@/models/setting'
import useMenuModel from '@/models/menu'
import usePostModel from '@/models/post'
import styles from './index.less'
// eslint-disable-next-line import/no-extraneous-dependencies
import H from 'history'
import MenuDTO from '@/types/MenuDTO'
import SettingDTO from '@/types/SettingDTO'

interface Location extends H.Location {
  query: { [key: string]: string }
}

interface PathParams {
  user_name: string
  tag_name: string
}

interface CategoryProps {
  match: match<PathParams>
  location: Location
}

const Category = (props: CategoryProps) => {
  const settingModel = useSettingModel()
  const menuModel = useMenuModel()
  const postModel = usePostModel()

  const setting: SettingDTO = settingModel.setting
  const menu: MenuDTO[] = menuModel.menu
  const { currentMenuPath, setCurrentMenuPath } = menuModel

  /**
   * 获取数据的函数
   */
  const getData = () => {
    // @ts-ignore
    const params: IndexPostListParamsType = props.match.params
    const query = props.location.query
    const condition: IndexPostListParamsType = {}
    params.tag_name && (condition.tag_name = params.tag_name)
    params.user_name && (condition.user_name = params.user_name)
    const idEn = params.secondCategory || params.firstCategory
    if (idEn) {
      condition.category_id = menu.find((item) => item.category_title_en === idEn)?._id
    }
    postModel.indexPostList({ ...condition, post_status: [0], ...query })

    // 设置菜单高亮
    const path = []
    params.firstCategory && path.push(params.firstCategory)
    params.secondCategory && path.push(params.secondCategory)

    setCurrentMenuPath(path)
  }

  /**
   * 获取数据
   */
  useEffect(() => {
    if (menu.length > 0) {
      getData()
    }
  }, [props.location.search, props.location.pathname, menu])

  /**
   * 分页事件
   * @param page
   * @param pageSize
   */
  const onPaginationChange = (page: number, limit?: number) => {
    history.push({
      pathname: props.location.pathname,
      query: { ...props.location.query, page, limit },
    })
  }

  /**
   * 获取title文案
   */
  const getTitle = () => {
    const { user_name, tag_name } = props.match.params
    if (user_name) {
      return `作者“${user_name}”下的所有文章`
    } else if (tag_name) {
      return `标签“${tag_name}”下的所有文章`
    } else {
      return ''
    }
  }

  const currentCategory = menu.find(
    (item) => item.category_title_en === currentMenuPath[currentMenuPath.length - 1],
  )

  return (
    <Spin spinning={postModel.loading}>
      <div className="container">
        <Helmet>
          {currentCategory && (
            <title>{`${currentCategory.category_title}_${setting.site_name}`}</title>
          )}
          {getTitle() !== '' && getTitle()}
          {props.match.path === '/' && <title>{`首页_${setting.site_name}`}</title>}
        </Helmet>
        {getTitle() !== '' && <div className={styles.title}>{getTitle()}</div>}
        {postModel.list.length > 0 ? (
          <>
            <PostListItem list={postModel.list} />
            <div className={styles.pagination}>
              <Pagination
                defaultCurrent={parseInt(props.location.query.page, 10) || 1}
                total={postModel.total}
                pageSize={parseInt(props.location.query.limit, 10) || 10}
                onChange={(page, pageSize) => onPaginationChange(page, pageSize)}
              />
            </div>
          </>
        ) : !postModel.loading ? (
          <Empty description="没有找到文章" />
        ) : null}
      </div>
    </Spin>
  )
}

export default Category
