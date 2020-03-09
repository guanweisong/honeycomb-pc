import request from '@/utils/request';

interface CaptchaType {
  randstr: string;
  ticket: string;
}

interface creatCommentType extends CaptchaType {
  comment_post: string;
  comment_email: string;
  comment_content: string;
  comment_author: string;
}

export default class CommentRequest {
  /**
   * 查询某个文章关联的评论列表
   * @param id 
   */
  public static index(id: string) {
    return request({
      url: `/comments/${id}`,
      method: 'get',
    })
  }

  /**
   * 创建新评论
   * @param params 
   */
  public static create(params: creatCommentType) {
    return request({
      url: '/comments',
      method: 'post',
      data: params,
    })
  }
}
