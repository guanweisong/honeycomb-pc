import React from 'react'
import {
  FileOutlined,
  VideoCameraOutlined,
  PictureOutlined,
  MessageOutlined,
} from '@ant-design/icons'

export default class Mapping {
  static postClass = {
    0: 'post',
    1: 'movie',
    2: 'gallery',
    3: 'quote',
  }

  static postIcon = {
    0: <FileOutlined />,
    1: <VideoCameraOutlined />,
    2: <PictureOutlined />,
    3: <MessageOutlined />,
  }
}
