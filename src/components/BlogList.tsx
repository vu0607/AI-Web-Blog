
'use client';

import { useEffect, useState } from 'react';
import { BlogCard } from './BlogCard';
import { getBlogPosts } from '@/lib/blog-service';

export const BlogList = () => {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const posts = getBlogPosts();
    setBlogPosts(posts);
  }, []);

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {blogPosts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
};
