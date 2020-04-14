import MenuResquest from '@/resquests/MenuResquest'
import { createModel } from 'hox'
import { useState } from 'react'
import { plainToClass } from 'class-transformer'
import MenuResponse from '@/responses/MenuResponse'

function UseMenu() {
  const [menu, setMenu] = useState([])
  const [currentMenuPath, setCurrentMenuPath] = useState([])

  /**
   * 查询分类菜单信息
   */
  const indexMenu = async () => {
    const result = await MenuResquest.indexMenu()
    const response = plainToClass(MenuResponse, result)
    console.log('indexCategory', response)
    if (response.isSuccess()) {
      setMenu(response.data.list)
    }
  }

  return {
    menu,
    indexMenu,
    currentMenuPath,
    setCurrentMenuPath,
  }
}

export default createModel(UseMenu)
