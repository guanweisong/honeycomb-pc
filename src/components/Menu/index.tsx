import React from 'react'
import { Link, withRouter } from 'umi'
import classNames from 'classnames'
// @ts-ignore
import listToTree from 'list-to-tree-lite'
import styles from './index.less'
// eslint-disable-next-line import/no-extraneous-dependencies
import H from 'history'
import useMenuModel from '@/models/menu'
import MenuDTO from '@/types/MenuDTO'

interface Location extends H.Location {
  query?: { [key: string]: string }
}

interface MenuProps {
  location: Location
}

const Menu = (props: MenuProps) => {
  const menuModel = useMenuModel()
  const { menu, currentMenuPath } = menuModel

  const formatCategorise = () => {
    const menuData = listToTree(menu, { idKey: '_id', parentKey: 'parent' })
    const result = [
      {
        category_title: '首页',
        category_title_en: '',
        isHome: true,
        type: 'category',
        children: [],
      },
    ]
    return [...result, ...menuData]
  }

  const renderSecondLevel = (firstLevel: MenuDTO, secondLevel: MenuDTO) => {
    if (secondLevel.type === 'category') {
      return (
        <li
          className={classNames({
            [styles['menu-second__item']]: true,
            [styles['menu-second__item--active']]:
              currentMenuPath[1] === secondLevel.category_title_en,
          })}
          key={secondLevel._id}
        >
          <div className={styles['menu-second__item-name']}>
            <Link to={`/category/${firstLevel.category_title_en}/${secondLevel.category_title_en}`}>
              {secondLevel.category_title}
            </Link>
          </div>
        </li>
      )
    }
    return (
      <li
        className={classNames({
          [styles['menu-second__item']]: true,
          [styles['menu-second__item--active']]: currentMenuPath[1] === secondLevel._id,
        })}
        key={secondLevel._id}
      >
        <div className={styles['menu-second__item-name']}>
          <Link to={`/pages/${secondLevel._id}`}>{secondLevel.page_title}</Link>
        </div>
      </li>
    )
  }

  const renderFirstLevel = (firstLevel: MenuDTO) => {
    if (firstLevel.type === 'category') {
      return (
        <li
          className={classNames({
            [styles['menu-first__item']]: true,
            [styles['menu-first__item--active']]:
              currentMenuPath[0] === firstLevel.category_title_en ||
              (firstLevel.category_title_en === '' && props.location.pathname === '/'),
          })}
          key={firstLevel.category_title_en}
        >
          <div className={styles['menu-first__item-name']}>
            <Link to={`${firstLevel.isHome ? '' : '/category'}/${firstLevel.category_title_en}`}>
              {firstLevel.category_title}
            </Link>
          </div>
          {firstLevel.children.length > 0 && (
            <ul className={styles['menu-second']}>
              {firstLevel.children.map((secondLevel) => renderSecondLevel(firstLevel, secondLevel))}
            </ul>
          )}
        </li>
      )
    }
    return (
      <li
        className={classNames({
          [styles['menu-first__item']]: true,
          [styles['menu-first__item--active']]:
            currentMenuPath[0] === firstLevel._id ||
            (firstLevel._id === '' && props.location.pathname === '/'),
        })}
        key={firstLevel._id}
      >
        <div className={styles['menu-first__item-name']}>
          <Link to={`${firstLevel.isHome ? '' : '/pages'}/${firstLevel._id}`}>
            {firstLevel.page_title}
          </Link>
        </div>
        {firstLevel.children.length > 0 && (
          <ul className={styles['menu-second']}>
            {firstLevel.children.map((secondLevel) => renderSecondLevel(firstLevel, secondLevel))}
          </ul>
        )}
      </li>
    )
  }

  const data = formatCategorise()

  return (
    <div className={styles.menu}>
      <ul className={styles['menu-first']}>
        {data.map((firstLevel) => renderFirstLevel(firstLevel))}
      </ul>
    </div>
  )
}

export default withRouter(Menu)
