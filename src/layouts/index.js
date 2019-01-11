import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Menu from '@/components/Menu';
import styles from './index.less';

@connect(({ app }) => ({ app }))
class BasicLayout extends PureComponent {
  render() {
    return (
      <div>
        <div className={styles.header}>
          <div className={`container ${styles["header__content"]}`}>
            <div className={styles["header__logo"]}>{this.props.app.setting.site_name}</div>
            <div className={styles["header__menu"]}><Menu/></div>
          </div>
        </div>
        { this.props.children }
        <div className={styles.footer}>
          ©{moment().format('YYYY')}&nbsp;{this.props.app.setting.site_copyright}
        </div>
      </div>
    );
  }
}

export default BasicLayout;
