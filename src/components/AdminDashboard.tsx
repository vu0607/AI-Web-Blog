
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/blog-service';
import type { BlogPost } from '@/lib/blog-service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { v4 as uuidv4 } from 'uuid';
import { suggestTags } from '@/ai/flows/suggest-tags'; // Import the AI flow
import ReactMarkdown from 'react-markdown'; // <-- Thêm import này
import remarkGfm from 'remark-gfm'; // <-- Thêm import này nếu bạn dùng GitHub Flavored Markdown (tables, strikethrough, etc.)

export const AdminDashboard = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState(''); // Content will now be Markdown
  const [tags, setTags] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state for posts
  const [isSubmitting, setIsSubmitting] = useState(false); // Submitting state for form
  const [isSuggestingTags, setIsSuggestingTags] = useState(false); // State for AI tag suggestion
  const router = useRouter();
  const { toast } = useToast();

  const fetchPosts = useCallback(() => {
    setIsLoading(true);
    try {
      const posts = getBlogPosts();
      setBlogPosts(posts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast({ title: "Error", description: "Could not load blog posts.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const resetForm = () => {
    setTitle('');
    setSummary('');
    setContent('');
    setTags('');
    setEditingPostId(null);
    setIsSubmitting(false);
    setIsSuggestingTags(false);
  };

  const handleSuggestTags = async () => {
    if (!content) {
      toast({ title: "Cannot Suggest Tags", description: "Please provide blog content first.", variant: "destructive" });
      return;
    }
    setIsSuggestingTags(true);
    try {
      const result = await suggestTags({ blogContent: content });
      if (result && result.tags) {
        setTags(result.tags.join(', '));
        toast({ title: "AI Suggested Tags", description: "Tags have been populated based on content." });
      } else {
         throw new Error("No tags returned");
      }
    } catch (error) {
      console.error("Error suggesting tags:", error);
      toast({ title: "AI Error", description: "Could not suggest tags.", variant: "destructive" });
    } finally {
      setIsSuggestingTags(false);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate async operation
    setTimeout(() => {
      try {
        const postData: BlogPost = { // Ensure BlogPost type matches expected structure
          id: editingPostId || uuidv4(),
          title,
          summary,
          content, // Content is now Markdown
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
          date: new Date().toISOString().slice(0, 10), // Or use existing date if editing
          // Add other necessary fields if your BlogPost type requires them
        };

        if (editingPostId) {
          // Find the existing post to preserve its original date if needed
          const existingPost = blogPosts.find(p => p.id === editingPostId);
          updateBlogPost(editingPostId, { ...postData, date: existingPost?.date || postData.date });
          toast({ title: "Success", description: "Blog post updated." });
        } else {
          createBlogPost(postData);
          toast({ title: "Success", description: "Blog post created." });
        }
        fetchPosts(); // Re-fetch posts to update the list
        resetForm();
      } catch (error: any) { // Catch potential errors more specifically if possible
         console.error("Error saving post:", error);
         // Provide more specific error feedback if possible
         const action = editingPostId ? 'update' : 'create';
         toast({ title: "Error", description: `Failed to ${action} post. ${error.message || ''}`, variant: "destructive" });
         setIsSubmitting(false); // Ensure submit button is re-enabled on error
      }
      // Removed finally block as setIsSubmitting(false) is handled in resetForm and catch block
    }, 500); // Simulate network delay
  };

  const handleDelete = (id: string) => {
     try {
       deleteBlogPost(id);
       fetchPosts(); // Re-fetch posts
       toast({ title: "Success", description: "Blog post deleted." });
       if (editingPostId === id) { // Reset form if editing the deleted post
         resetForm();
       }
     } catch (error) {
       console.error("Error deleting post:", error);
       toast({ title: "Error", description: "Failed to delete post.", variant: "destructive" });
     }
  };

  const handleEdit = (post: BlogPost) => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
    setEditingPostId(post.id);
    setTitle(post.title);
    setSummary(post.summary);
    setContent(post.content);
    setTags(post.tags.join(', '));
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    toast({ title: "Logged Out", description: "You have been logged out." });
    router.push('/login');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
         <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
         <Button onClick={handleLogout} variant="outline" size="sm">
           <Icons.logOut className="mr-2 h-4 w-4" /> Logout
         </Button>
      </div>

      {/* Create/Edit Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>{editingPostId ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Title"
              aria-label="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <Textarea
              placeholder="Summary (Short description)"
              aria-label="Post Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              disabled={isSubmitting}
              rows={2}
            />

            {/* Markdown Editor and Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Markdown Input */}
              <div className="space-y-2">
                 <label htmlFor="content" className="text-sm font-medium">Content (Markdown)</label>
                 <Textarea
                   id="content"
                   placeholder="Write your blog content using Markdown..."
                   aria-label="Post Content in Markdown"
                   value={content}
                   onChange={(e) => setContent(e.target.value)}
                   required
                   disabled={isSubmitting}
                   rows={15} // Adjust rows as needed
                   className="min-h-[300px] font-mono text-sm" // Style for code editing feel
                 />
              </div>

              {/* Markdown Preview */}
              <div className="space-y-2">
                 <label className="text-sm font-medium">Preview</label>
                 <Card className="min-h-[300px] h-full p-4 border rounded-md overflow-auto">
                   <div className="prose dark:prose-invert max-w-none">
                     {/* Ensure ReactMarkdown is used here */}
                     <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "*Preview will appear here*"}</ReactMarkdown>
                   </div>
                 </Card>
              </div>
            </div>


            {/* Tags Input and AI Suggestion */}
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <Input
                  type="text"
                  placeholder="Tags (comma separated, e.g., AI, Tech, News)"
                  aria-label="Post Tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  disabled={isSubmitting}
                  className="flex-grow"
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleSuggestTags}
                    disabled={isSubmitting || isSuggestingTags || !content}
                    className="w-full sm:w-auto flex-shrink-0"
                    size="sm"
                  >
                    {isSuggestingTags ? <Icons.loader className="mr-2 animate-spin" /> : <Icons.bot className="mr-2" />}
                    {isSuggestingTags ? 'Suggesting...' : 'Suggest Tags (AI)'}
                 </Button>
             </div>

            <div className="flex justify-end gap-2 pt-4">
              {editingPostId && (
                 <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
                   Cancel Edit
                 </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Icons.loader className="mr-2 animate-spin" /> : (editingPostId ? <Icons.save className="mr-2" /> : <Icons.plusCircle className="mr-2" />)}
                {isSubmitting ? 'Saving...' : (editingPostId ? 'Update Post' : 'Create Post')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Blog Posts List Card */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center p-8">
               <Icons.loader className="h-8 w-8 animate-spin text-primary mx-auto" />
               <p className="text-muted-foreground mt-2">Loading posts...</p>
            </div>
          ) : blogPosts.length === 0 ? (
             <p className="text-muted-foreground text-center p-8">No blog posts yet. Create one above!</p>
          ) : (
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <Card key={post.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 shadow-sm border">
                  <div className="mb-3 sm:mb-0 flex-grow mr-4"> {/* Added flex-grow and margin */}
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.summary}</p> {/* Added line-clamp */}
                     <div className="mt-2 flex flex-wrap gap-1">
                        {post.tags?.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                     </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 self-start sm:self-center"> {/* Adjusted alignment */}
                    <Button size="sm" variant="outline" onClick={() => handleEdit(post)} aria-label={`Edit ${post.title}`}>
                      <Icons.edit className="h-4 w-4" />
                    </Button>
                    {/* Delete Confirmation Dialog */}
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" aria-label={`Delete ${post.title}`}>
                          <Icons.trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the blog post titled "{post.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(post.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                             Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Add necessary icons to src/components/icons.ts if they don't exist:
// logOut, save
