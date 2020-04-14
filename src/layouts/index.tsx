import React, { useEffect, ReactNode } from 'react'
import { Link } from 'umi'
import moment from 'moment'
import classNames from 'classnames'
import Menu from '@/components/Menu'
import { BackTop } from 'antd'
// eslint-disable-next-line import/no-extraneous-dependencies
import H from 'history'
import useSettingModel from '@/models/setting'
import useMenuModel from '@/models/menu'
import SettingDTO from '@/types/SettingDTO'
import styles from './index.less'

interface Location extends H.Location {
  query: { [key: string]: string }
}

interface IProps {
  children: ReactNode
  location: Location
}

const BasicLayout = (props: IProps) => {
  const settingModel = useSettingModel()
  const menuModel = useMenuModel()

  const setting: SettingDTO = settingModel.setting

  useEffect(() => {
    settingModel.indexSetting()
    menuModel.indexMenu()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [props.location])
  return (
    <div
      className={classNames({
        [styles.layout]: true,
      })}
    >
      <div className={styles.header}>
        <div className={`container ${styles.header__content}`}>
          <div className={styles.header__logo}>
            <Link to="/">{setting.site_name}</Link>
          </div>
          <div className={styles.header__menu}>
            <Menu />
          </div>
        </div>
      </div>
      <div className={styles.body}>{props.children}</div>
      <div className={styles.footer}>
        <div>{setting.site_signature}</div>
        <div>
          ©{moment().format('YYYY')}&nbsp;{setting.site_copyright}
          &nbsp;
          {setting.site_record_no ? (
            setting.site_record_url ? (
              <a
                href={`${setting.site_record_url}`}
                target="_blank"
                rel="nofollow"
                className="link-light"
              >
                {setting.site_record_no}
              </a>
            ) : (
              setting.site_record_no
            )
          ) : null}
        </div>
      </div>
      <BackTop />
    </div>
  )
}

export default BasicLayout
