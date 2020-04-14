import React from 'react'
import { Link } from 'umi'
import TagDTO from '@/types/TagDTO'
import PostDTO from '@/types/PostDTO'

const Tag = (props: PostDTO) => {
  const getTags = (item: PostDTO) => {
    const arr = []
    const result: TagDTO[] = []
    if (item.post_type === 1) {
      arr.push(item.movie_director)
      arr.push(item.movie_actor)
      arr.push(item.movie_style)
    }
    if (item.post_type === 2) {
      arr.push(item.gallery_style)
    }
    arr.forEach((m) => {
      m &&
        m.forEach((n) => {
          result.push(n)
        })
    })
    return result
  }

  const tags = getTags(props)

  return (
    <span>
      {tags.map((item, index) => {
        return (
          <span key={item._id}>
            {index !== 0 && '、'}
            <Link to={`/tags/${encodeURI(item.tag_name)}`} className="link-light">
              {item.tag_name}
            </Link>
          </span>
        )
      })}
    </span>
  )
}

export default Tag
