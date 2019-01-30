import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import classnames from 'classnames';
import Menu from '@/components/Menu';
import styles from './index.less';
import { BackTop } from 'antd';

@connect(({ app }) => ({ app }))
class BasicLayout extends PureComponent {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }
  render() {
    return (
      <div
        className={classnames({
          [styles.layout]: true,
        })}
      >
        <div className={styles.header}>
          <div className={`container ${styles["header__content"]}`}>
            <div className={styles["header__logo"]}><Link to="/">{this.props.app.setting.site_name}</Link></div>
            <div className={styles["header__menu"]}><Menu/></div>
          </div>
        </div>
        <div className={styles.body}>
        { this.props.children }
        </div>
        <div className={styles.footer}>
          ©{moment().format('YYYY')}&nbsp;{this.props.app.setting.site_copyright}
        </div>
        <BackTop />
      </div>
    );
  }
}

export default BasicLayout;
