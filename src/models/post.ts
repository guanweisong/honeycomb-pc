import PostResquest, {
  IndexPostListParamsType,
  IndexRandomPostListParamsType,
} from '@/resquests/PostResquest'
import { createModel } from 'hox'
import { useState } from 'react'
import { plainToClass } from 'class-transformer'
import ListResponse from '@/responses/post/ListResponse'
import DetailResponse from '@/responses/post/DetailResponse'
import RadomResponse from '@/responses/post/RadomResponse'
import PostDTO from '@/types/PostDTO'

function UsePost() {
  const [list, setList] = useState<PostDTO[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState({})
  const [randomPostsList, setRandomPostsList] = useState({})

  /**
   * 查询文章列表
   * @param values
   */
  const indexPostList = async (values: IndexPostListParamsType) => {
    setLoading(true)
    const result = await PostResquest.indexPostList(values)
    const response = plainToClass(ListResponse, result)
    console.log('indexPostList', response)
    if (response.isSuccess()) {
      setList(response.data.list)
      setTotal(response.data.total)
    }
    setLoading(false)
  }

  /**
   * 查询文章详情
   * @param postId
   */
  const indexPostDetail = async (postId: string) => {
    setLoading(true)
    const result = await PostResquest.indexPostDetail(postId)
    const response = plainToClass(DetailResponse, result)
    console.log('indexPostDetail', response)
    if (response.isSuccess()) {
      setDetail({ ...detail, [response.data._id]: response.data })
    }
    setLoading(false)
  }

  /**
   * 查询相关随机文章列表
   * @param values
   */
  const indexRandomPostByCategoryId = async (values: IndexRandomPostListParamsType) => {
    const result = await PostResquest.indexRandomPostByCategoryId(values)
    const response = plainToClass(RadomResponse, result)
    console.log('indexRandomPostByCategoryId', response)
    if (response.isSuccess()) {
      setRandomPostsList({ ...randomPostsList, [values.post_id]: response.data })
    }
  }

  return {
    list,
    total,
    loading,
    detail,
    randomPostsList,
    indexPostList,
    indexPostDetail,
    indexRandomPostByCategoryId,
  }
}

export default createModel(UsePost)
