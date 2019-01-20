import React, { PureComponent } from 'react';
import Link from 'umi/link';

export default class Tag extends PureComponent {
  constructor(props){
    super(props);
  }
  getTags(item) {
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
  render () {
    const tags = this.getTags(this.props.data);
    return (
      <span>
        <For each="item" index="index" of={tags}>
          <If condition={index !== 0}>、</If>
          <Link to={`/tags/${encodeURI(item.tag_name)}`} className="link-light" key={index}>{item.tag_name}</Link>
        </For>
      </span>
    )
  }
}
