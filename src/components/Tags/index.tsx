import React from 'react';
import Link from 'umi/link';

const Tag = (props) => {

  const getTags = (item) => {
    const arr = [];
    const result = [];
    if (item.post_type === 1) {
      arr.push(item.movie_director);
      arr.push(item.movie_actor);
      arr.push(item.movie_style);
    }
    if (item.post_type === 2) {
      arr.push(item.gallery_style);
    }
    arr.forEach((m) => {
      m.forEach((n) => {
        result.push(n);
      });
    });
    return result;
  }

  const tags = getTags(props.data);

  return (
    <span>
      {
        tags.map((item, index) => {
          return(
            <span key={item._id}>
              {index !== 0 && '、'}
              <Link to={`/tags/${encodeURI(item.tag_name)}`} className="link-light">{item.tag_name}</Link>
            </span>
          )
        })
      }
    </span>
  )
}


export default Tag;
