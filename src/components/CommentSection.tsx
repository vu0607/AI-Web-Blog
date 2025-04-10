
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim() !== '' && name.trim() !== '') {
      setComments([...comments, { author: name, text: newComment }]);
      setNewComment('');
      setName('');
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4">Comments</h3>
      {comments.map((comment, index) => (
        <div key={index} className="mb-4 p-4 rounded-md bg-gray-100">
          <p className="font-semibold">{comment.author}</p>
          <p>{comment.text}</p>
        </div>
      ))}
      <form onSubmit={handleSubmitComment} className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Textarea
          placeholder="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        <Button type="submit">Submit Comment</Button>
      </form>
    </div>
  );
};
