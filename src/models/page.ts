import PageResquest from '@/resquests/PageResquest'
import { createModel } from 'hox'
import { useState } from 'react'
import { plainToClass } from 'class-transformer'
import PageResponse from '@/responses/PageResponse'

function UsePage() {
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState({})

  /**
   * 查询页面详情
   * @param postId
   */
  const indexPageDetail = async (pageId: string) => {
    setLoading(true)
    const result = await PageResquest.indexPageDetail(pageId)
    const response = plainToClass(PageResponse, result)
    console.log('indexPageDetail', response)
    if (response.isSuccess()) {
      setDetail({ ...detail, [response.data._id]: response.data })
    }
    setLoading(false)
  }

  return {
    loading,
    detail,
    indexPageDetail,
  }
}

export default createModel(UsePage)
