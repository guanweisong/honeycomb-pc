import CommentRequest from '@/resquests/CommentRequest'
import { message } from 'antd'
import { createModel } from 'hox'
import { useState } from 'react'
import { plainToClass } from 'class-transformer'
import CommentResponse from '@/responses/CommentResponse'
import BaseResponse from '@/responses/BaseResponse'
import CommentDTO from '@/types/CommentDTO'

function UseComment() {
  const [list, setList] = useState<CommentDTO[]>([])
  const [total, setTotal] = useState(0)
  const [replyTo, setReplyTo] = useState(null)
  const [loading, setLoading] = useState(false)

  /**
   * 查询文章关联的评论列表
   * @param postId
   */
  const index = async (postId: string) => {
    setLoading(true)
    const result = await CommentRequest.index(postId)
    const response = plainToClass(CommentResponse, result)
    console.log('commentIndex', response)
    if (response.isSuccess()) {
      setList(response.data.list)
      setTotal(response.data.total)
    }
    setLoading(false)
  }

  /**
   * 创建新评论
   * @param values
   */
  const create = async (values: any) => {
    const result = await CommentRequest.create(values)
    const response = plainToClass(BaseResponse, result)
    if (response.isSuccess()) {
      message.success('发布成功')
      index(values.comment_post)
    }
  }

  return {
    list,
    total,
    replyTo,
    setReplyTo,
    loading,
    index,
    create,
  }
}

export default createModel(UseComment)
