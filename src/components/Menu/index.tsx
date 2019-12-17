import React from 'react';
import Link from 'umi/link';
import { withRouter } from 'react-router';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
// @ts-ignore
import listToTree from 'list-to-tree-lite';
import styles from './index.less';
import { MenuStateType } from '@/models/menu';
import { MenuType } from '@/types/menu';
import { GlobalStoreType } from '@/types/globalStore';
import { AnyAction, Dispatch } from 'redux';

interface MenuProps {
  dispatch: Dispatch<AnyAction>;
}

const Menu = (props: MenuProps) => {
  const { menu, currentCategoryPath } = useSelector<GlobalStoreType, MenuStateType>(state => state.menu);

  const formatCategorise = () => {
    const menuData = listToTree(menu, {idKey: '_id', parentKey: 'category_parent'});
    const result = [
      {
        category_title: '首页',
        category_title_en: '',
        isHome: true,
        children: [],
      }
    ];
    return [...result, ...menuData];
  };

  const renderFirstLevel = (firstLevel: MenuType) => {
    return (
      <li
        className={classNames({
          [styles["menu-first__item"]]: true,
          [styles["menu-first__item--active"]]: currentCategoryPath[0] === firstLevel.category_title_en || (firstLevel.category_title_en === '' && props.location.pathname === '/'),
        })}
        key={firstLevel.category_title_en}
      >
        <div className={styles["menu-first__item-name"]}>
          <Link to={`${firstLevel.isHome ? '': '/category'}/${firstLevel.category_title_en}`}>{firstLevel.category_title}</Link>
        </div>
        {
          firstLevel.children.length > 0 && (
            <ul className={styles["menu-second"]}>
              {
                firstLevel.children.map(secondLevel => renderSecondLevel(firstLevel, secondLevel))
              }
            </ul>
          )
        }
      </li>
    )
  }

  const renderSecondLevel = (firstLevel: MenuType, secondLevel: MenuType) => {
    return (
      <li
        className={classNames({
          [styles["menu-second__item"]]: true,
          [styles["menu-second__item--active"]]: currentCategoryPath[1] === secondLevel.category_title_en,
        })}
        key={secondLevel.category_title_en}
      >
        <div className={styles["menu-second__item-name"]}>
          <Link to={`/category/${firstLevel.category_title_en}/${secondLevel.category_title_en}`}>{secondLevel.category_title}</Link>
        </div>
      </li>
    )
  }

  const data = formatCategorise();

  return (
    <div className={styles["menu"]}>
      <ul className={styles["menu-first"]}>
        {
          data.map(firstLevel => renderFirstLevel(firstLevel))
        }
      </ul>
    </div>
  );
}

export default withRouter(Menu);
