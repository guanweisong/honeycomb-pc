import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import Menu from '@/components/Menu';
import styles from './index.less';

@connect(({ app }) => ({ app }))
class BasicLayout extends PureComponent {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }
  render() {
    return (
      <div>
        <div className={styles.header}>
          <div className={`container ${styles["header__content"]}`}>
            <div className={styles["header__logo"]}><Link to="/">{this.props.app.setting.site_name}</Link></div>
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
