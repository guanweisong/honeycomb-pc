import React from 'react';
import { Link } from 'umi';
import classNames from 'classnames';
// @ts-ignore
import listToTree from 'list-to-tree-lite';
import styles from './index.less';
import H from 'history';
import useMenuModel from "@/models/menu";
import { withRouter } from "umi";
import MenuDTO from "@/types/MenuDTO";

interface Location extends H.Location {
  query?: {[key: string]: string};
}

interface MenuProps {
  location: Location;
}

const Menu = (props: MenuProps) => {

  const menuModel = useMenuModel();
  const { menu, currentCategoryPath } = menuModel;

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

  const renderFirstLevel = (firstLevel: MenuDTO) => {
    return (
      <li
        className={classNames({
          [styles["menu-first__item"]]: true,
          // @ts-ignore
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

  const renderSecondLevel = (firstLevel: MenuDTO, secondLevel: MenuDTO) => {
    return (
      <li
        className={classNames({
          [styles["menu-second__item"]]: true,
          // @ts-ignore
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
