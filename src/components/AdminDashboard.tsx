
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/blog-service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';

export const AdminDashboard = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const posts = getBlogPosts();
    setBlogPosts(posts);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      id: uuidv4(),
      title,
      summary,
      content,
      tags: tags.split(',').map(tag => tag.trim()),
      date: new Date().toISOString().slice(0, 10),
    };
    createBlogPost(newPost);
    setBlogPosts([...blogPosts, newPost]);
    setTitle('');
    setSummary('');
    setContent('');
    setTags('');
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedPost = {
      title,
      summary,
      content,
      tags: tags.split(',').map(tag => tag.trim()),
    };
    updateBlogPost(editingPostId, updatedPost);
    const updatedPosts = blogPosts.map(post =>
      post.id === editingPostId ? { ...post, ...updatedPost } : post
    );
    setBlogPosts(updatedPosts);
    setEditingPostId(null);
    setTitle('');
    setSummary('');
    setContent('');
    setTags('');
  };

  const handleDelete = (id) => {
    deleteBlogPost(id);
    const updatedPosts = blogPosts.filter(post => post.id !== id);
    setBlogPosts(updatedPosts);
  };

  const handleEdit = (post) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setSummary(post.summary);
    setContent(post.content);
    setTags(post.tags.join(', '));
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>
      <Button onClick={handleLogout} className="mb-4">Logout</Button>

      <form onSubmit={editingPostId ? handleUpdate : handleSubmit} className="flex flex-col gap-4 mb-8">
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        />
        <Textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <Button type="submit">{editingPostId ? 'Update Post' : 'Create Post'}</Button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">Blog Posts</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <div key={post.id} className="rounded-lg border shadow-md p-4">
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-600">{post.summary}</p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" onClick={() => handleEdit(post)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(post.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
