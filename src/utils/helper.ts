export default class Helper {
  /**
   * 根据分类ID生成全路径分类目录path
   * @param pid 当前分类的ID
   * @param arr 全量menu数组
   * @returns {string}
   */
  static getFullCategoryPathById(pid: string, arr: any) {
    const temp = []
    const path = ['/category']
    const forFn = (arr, pid) => {
      for (const value of arr) {
        const item = value
        if (item._id == pid) {
          temp.push(item)
          forFn(arr, item.category_parent)
        }
      }
    }
    forFn(arr, pid)
    temp.reverse().forEach((item) => {
      path.push(item.category_title_en)
    })
    return path.join('/')
  }
}
