
'use client'; // Needed for useEffect, useState

import { useEffect, useState } from 'react';
import { getBlogPost, getBlogPosts } from '@/lib/blog-service';
import type { BlogPost } from '@/lib/blog-service'; // Import the type
import { CommentSection } from '@/components/CommentSection';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogList } from '@/components/BlogList'; // For related posts
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons'; // Import Icons

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined); // undefined for loading state
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const fetchedPost = getBlogPost(params.id);
      setPost(fetchedPost);

      if (fetchedPost) {
        // Fetch related posts (simple logic: other posts with at least one common tag)
        const allPosts = getBlogPosts();
        const related = allPosts.filter(p =>
          p.id !== fetchedPost.id &&
          p.tags?.some(tag => fetchedPost.tags?.includes(tag))
        ).slice(0, 3); // Limit to 3 related posts
        setRelatedPosts(related);
      }
    } catch (error) {
      console.error("Error fetching blog post data:", error);
      setPost(null); // Set to null on error
    } finally {
      setLoading(false);
    }
  }, [params.id]);

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
                src={`https://picsum.photos/seed/${post.id}/1200/600`} // Larger Placeholder image
                alt={`Header image for ${post.title}`}
                layout="fill"
                objectFit="cover"
                priority // Prioritize loading header image
                data-ai-hint="technology blog post theme" // AI hint for image generation
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

        {/* Post Content */}
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

      </article>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="max-w-4xl mx-auto mt-12">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Related Posts</h2>
            <BlogList posts={relatedPosts} />
          </section>
        )}


      {/* Comment Section */}
      <section className="max-w-4xl mx-auto mt-12">
         <CommentSection />
      </section>
    </div>
  );
}
