import { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../lib/api';
import { BLOGS } from '../data/mock';

let cache = null;

export const useBlogs = () => {
  const [posts, setPosts] = useState(cache);
  useEffect(() => {
    let alive = true;
    axios.get(`${API}/blog`)
      .then(({ data }) => { cache = data; if (alive) setPosts(data); })
      .catch(() => { if (alive) setPosts(cache || BLOGS); });
    return () => { alive = false; };
  }, []);
  return posts;
};
