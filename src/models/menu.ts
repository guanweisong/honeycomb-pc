import MenuResquest from '@/resquests/MenuResquest';
import { createModel } from "hox";
import { useState } from 'react';
import { plainToClass } from "class-transformer";
import MenuResponse from '@/responses/MenuResponse';

function UseMenu() {
  const [menu, setMenu] = useState([]);
  const [currentCategoryPath, setCurrentCategoryPath] = useState([]);

  /**
   * 查询分类菜单信息
   */
  const indexMenu = async () => {
    const result =  await MenuResquest.indexMenu();
    const response = plainToClass(MenuResponse, result);
    console.log('indexMenu', response);
    if (response.isSuccess()) {
      setMenu(response.data.son);
    }
  }

  return {
    menu,
    indexMenu,
    currentCategoryPath,
    setCurrentCategoryPath,
  }
}

export default createModel(UseMenu);
