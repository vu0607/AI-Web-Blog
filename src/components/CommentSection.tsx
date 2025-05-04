
'use client';

import React, { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons'; // Import Icons

interface Comment {
  author: string;
  text: string;
  timestamp: Date;
}

export const CommentSection = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state

  const handleSubmitComment = (e: FormEvent) => {
    e.preventDefault();
    if (newComment.trim() !== '' && name.trim() !== '') {
       setIsSubmitting(true); // Set submitting state
      // Simulate API call delay
      setTimeout(() => {
        setComments([...comments, { author: name, text: newComment, timestamp: new Date() }]);
        setNewComment('');
        setName('');
         setIsSubmitting(false); // Reset submitting state
      }, 500); // Simulate network latency
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
           <Icons.messageSquare className="h-6 w-6" /> Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Display Existing Comments */}
        {comments.length === 0 && (
          <p className="text-muted-foreground text-center py-4">Be the first to comment!</p>
        )}
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Avatar className="mt-1">
                 {/* Placeholder Avatar - Can be customized */}
                 <AvatarFallback>{comment.author.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 bg-muted/50 p-3 rounded-md">
                <div className="flex justify-between items-center mb-1">
                   <p className="font-semibold text-sm">{comment.author}</p>
                   <p className="text-xs text-muted-foreground">
                     {comment.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {comment.timestamp.toLocaleDateString()}
                   </p>
                </div>
                <p className="text-sm">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="space-y-4 border-t pt-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Your Name"
              aria-label="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-9"
            />
           </div>
          <Textarea
            placeholder="Write your comment here..."
            aria-label="Comment text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
            rows={3}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
             {isSubmitting ? <Icons.loader className="mr-2 animate-spin" /> : <Icons.send className="mr-2" /> }
             {isSubmitting ? 'Submitting...' : 'Submit Comment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
