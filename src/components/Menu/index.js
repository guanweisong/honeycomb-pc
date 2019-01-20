import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { withRouter } from "react-router";
import classNames from 'classnames';
import listToTree from 'list-to-tree-lite';
import styles from './index.less';

@withRouter
@connect(({ app }) => ({ app }))
class Menu extends PureComponent {
  constructor(props){
    super(props)
  };
  formatCategorise = () => {
    const menu = listToTree(this.props.app.menu, {idKey: '_id', parentKey: 'category_parent'});
    const result = [
      {
        category_title: '首页',
        category_title_en: '',
        isHome: true,
        children: [],
      }
    ];
    return [...result, ...menu];
  };
  render () {
    const data = this.formatCategorise();
    return (
      <div className={styles["menu"]}>
        <ul className={styles["menu-first"]}>
          <For each="firstLevel" of={data}>
            <li
              className={classNames({
                [styles["menu-first__item"]]: true,
                [styles["menu-first__item--active"]]: this.props.app.currentCategoryPath[0] === firstLevel.category_title_en || (firstLevel.category_title_en === '' && this.props.location.pathname === '/'),
              })}
              key={firstLevel.category_title_en}
            >
              <div className={styles["menu-first__item-name"]}>
                <Link to={`${firstLevel.isHome === true ? '': '/category'}/${firstLevel.category_title_en}`}>{firstLevel.category_title}</Link>
              </div>
              <If condition={firstLevel.children.length > 0}>
                <ul className={styles["menu-second"]}>
                  <For each="secondLevel" of={firstLevel.children}>
                    <li
                      className={classNames({
                        [styles["menu-second__item"]]: true,
                        [styles["menu-second__item--active"]]: this.props.app.currentCategoryPath[1] === secondLevel.category_title_en,
                      })}
                      key={secondLevel.category_title_en}
                    >
                      <div className={styles["menu-second__item-name"]}>
                        <Link to={`/category/${firstLevel.category_title_en}/${secondLevel.category_title_en}`}>{secondLevel.category_title}</Link>
                      </div>
                    </li>
                  </For>
                </ul>
              </If>
            </li>
          </For>
        </ul>
      </div>
    )
  }
}

export default Menu;
