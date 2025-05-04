
'use client'; // Keep this if you use client-side hooks like useState/useEffect

import { useState, useEffect, use } from 'react'; // Import 'use' from React
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBlogPost, getBlogPosts } from '@/lib/blog-service';
import type { BlogPost } from '@/lib/blog-service';
import { CommentSection } from '@/components/CommentSection';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BlogList } from '@/components/BlogList';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons';

// Update the function signature to accept params as a Promise if needed,
// but since this is a Client Component using useEffect, we'll keep the standard props
// and access params directly within useEffect or where needed.
// The warning might be more relevant for Server Components directly using params.
// However, if the warning persists specifically for this Client Component structure,
// it might indicate a deeper configuration issue or a misunderstanding of the warning's context.
// Let's stick to the current structure as direct access is still supported for migration.
// If you were converting this to a Server Component or using Suspense heavily, `use(params)` would be necessary.

// For now, let's ensure the existing client-side logic is robust.
export default function BlogPostPage({ params }: { params: { id: string } }) {
  // const resolvedParams = use(params); // Use this if it were a Server Component or using Suspense features directly with params
  const postId = params.id; // Continue using direct access for now in this Client Component

  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      // Use postId derived from params
      const fetchedPost = getBlogPost(postId);
      setPost(fetchedPost);

      if (fetchedPost) {
        const allPosts = getBlogPosts();
        const related = allPosts.filter(p =>
          p.id !== fetchedPost.id &&
          p.tags?.some(tag => fetchedPost.tags?.includes(tag))
        ).slice(0, 3);
        setRelatedPosts(related);
      } else {
         setRelatedPosts([]);
      }
    } catch (error) {
      console.error("Error fetching blog post data:", error);
      setPost(null);
      setRelatedPosts([]);
    } finally {
      setLoading(false);
    }
    // Depend on postId
  }, [postId]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 space-y-8">
         <Skeleton className="h-10 w-3/4" /> {/* Title Skeleton */}
         <Skeleton className="h-6 w-1/4" /> {/* Date Skeleton */}
         <Skeleton className="h-64 w-full" /> {/* Image Skeleton */}
         <div className="space-y-4"> {/* Content Skeleton */}
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
         </div>
      </div>
    );
  }

  if (!post) {
    return (
       <Card className="container mx-auto my-10 text-center p-8 border-dashed">
        <CardContent className="flex flex-col items-center gap-4">
          <Icons.fileX className="h-12 w-12 text-destructive" /> {/* Error Icon */}
          <p className="text-xl font-semibold">Blog Post Not Found</p>
          <p className="text-muted-foreground">The post you are looking for does not exist or may have been removed.</p>
          {/* Optional: Link back home */}
        </CardContent>
      </Card>
    );
  }


  return (
    <div className="container mx-auto py-10">
      <article className="max-w-4xl mx-auto bg-card p-6 sm:p-8 rounded-lg shadow-md">
        {/* Post Header */}
        <header className="mb-8 pb-6 border-b">
           {/* AI Generated Placeholder Image */}
            <div className="relative h-72 w-full mb-6 rounded-md overflow-hidden bg-muted">
              <Image
                // Consider using a more relevant placeholder or actual image if available
                src={`https://picsum.photos/seed/${post.id}/1200/600`} // Use post.id here
                alt={`Header image for ${post.title}`}
                fill // Use fill instead of layout="fill"
                style={{objectFit: "cover"}} // Use style object for objectFit
                priority // Prioritize loading header image
                // data-ai-hint="technology blog post theme" // AI hint for image generation - Removed as it's not a standard prop
              />
            </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">{post.title}</h1>
          <p className="text-muted-foreground text-sm">
            Published on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
           {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags && post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        {/* Post Content - Render Markdown */}
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

      </article>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="max-w-4xl mx-auto mt-12">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Related Posts</h2>
            {/* Ensure BlogList can handle the posts */}
            <BlogList posts={relatedPosts} />
          </section>
        )}


      {/* Comment Section */}
      <section className="max-w-4xl mx-auto mt-12">
         {/* Ensure CommentSection is implemented */}
         <CommentSection postId={postId} /> {/* Pass postId to CommentSection */}
      </section>
    </div>
  );
}
