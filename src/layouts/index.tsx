import React, { useEffect, ReactNode } from 'react';
import Link from 'umi/link';
import moment from 'moment';
import classnames from 'classnames';
import Menu from '@/components/Menu';
import { withRouter } from "react-router";
import { BackTop } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.less';
import H from 'history';
import { GlobalStoreType } from '@/types/globalStore';
import { SettingStateType } from '@/models/setting';

interface Location extends H.Location {
  query: {[key: string]: string};
}

interface IProps {
  children: ReactNode;
  location: Location;
}

const BasicLayout = (props: IProps) => {
  const { setting } = useSelector<GlobalStoreType, SettingStateType>(state => state.setting);
  const dispatch = useDispatch();

  useEffect(()=> {
    dispatch({
      type: 'setting/indexSetting',
      payload: {},
    });
    dispatch({
      type: 'menu/indexMenu',
      payload: {},
    })
  }, []);

  useEffect(()=> {
    window.scrollTo(0, 0);
  }, [props.location]);

  return (
    <div
      className={classnames({
        [styles.layout]: true,
      })}
    >
      <div className={styles.header}>
        <div className={`container ${styles["header__content"]}`}>
          <div className={styles["header__logo"]}><Link to="/">{setting.site_name}</Link></div>
          <div className={styles["header__menu"]}><Menu/></div>
        </div>
      </div>
      <div className={styles.body}>
        {props.children}
      </div>
      <div className={styles.footer}>
        <div>{setting.site_signature}</div>
        <div>©{moment().format('YYYY')}&nbsp;{setting.site_copyright}</div>
      </div>
      <BackTop />
    </div>
  )
}

// @ts-ignore
export default withRouter(BasicLayout);
