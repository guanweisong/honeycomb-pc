import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { withRouter } from "react-router";
import classNames from 'classnames';
import styles from './index.less';

@withRouter
@connect(({ app }) => ({ app }))
class Menu extends PureComponent {
  constructor(props){
    super(props)
  };
  formatCategorise = () => {
    const data = this.props.app.menu;
    const result = [
      {
        category_title: '首页',
        category_title_en: '',
        isHome: true,
      }
    ];
    data.forEach((item) => {
      if (item.category_parent === "0") {
        result.push(item);
      }
    });
    result.forEach((item) => {
      item.child = [];
      data.forEach((n) => {
        if (n.category_parent === item._id) {
          item.child.push(n);
        }
      });
    });
    return result;
  };
  getActiveStatus = (category_title_en) => {
    let flag = false;
    if (category_title_en === '') {
      if (this.props.location.pathname === '/') {
        flag = true;
      }
    } else {
      if (this.props.location.pathname.indexOf(category_title_en) !== -1) {
        flag = true;
      }
    }
    return flag;
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
                [styles["menu-first__item--active"]]: this.getActiveStatus(firstLevel.category_title_en),
              })}
              key={firstLevel.category_title_en}
            >
              <div className={styles["menu-first__item-name"]}>
                <Link to={`${firstLevel.isHome === true ? '': '/category'}/${firstLevel.category_title_en}`}>{firstLevel.category_title}</Link>
              </div>
              <If condition={firstLevel.child.length > 0}>
                <ul className={styles["menu-second"]}>
                  <For each="secondLevel" of={firstLevel.child}>
                    <li
                      className={classNames({
                        [styles["menu-second__item"]]: true,
                        [styles["menu-second__item--active"]]: this.getActiveStatus(secondLevel.category_title_en),
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
