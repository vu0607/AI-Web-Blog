
'use client'; // Required for useEffect and useState

import React, { useState, useEffect } from 'react';
import { BlogList } from '@/components/BlogList';
import { getBlogPosts } from '@/lib/blog-service';
import type { BlogPost } from '@/lib/blog-service'; // Import the type
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons'; // Import Icons

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const fetchedPosts = getBlogPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Failed to load blog posts:", error);
      // Handle error state if needed
    } finally {
      setLoading(false);
    }
  }, []);

  // Find the latest post to feature (or the first one if dates aren't reliable)
  const featuredPost = posts.length > 0 ? posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null;

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-b from-primary/10 to-background rounded-lg shadow-sm">
        <Icons.bot className="h-16 w-16 text-primary mx-auto mb-4" /> {/* AI Icon */}
        <h1 className="text-4xl font-bold mb-3 tracking-tight">Welcome to AI Blog Central</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Exploring the frontiers of Artificial Intelligence, Machine Learning, and beyond. Stay updated with the latest trends and insights.
        </p>
      </section>

      {/* Featured Post Section */}
      {loading && !featuredPost && (
        <Card className="overflow-hidden shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <Skeleton className="h-64 w-full" />
          <CardContent className="pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mt-2" />
          </CardContent>
        </Card>
      )}
      {featuredPost && (
        <section>
           <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Featured Post</h2>
           <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">{featuredPost.title}</CardTitle>
                <CardDescription>Published on {new Date(featuredPost.date).toLocaleDateString()}</CardDescription>
              </CardHeader>
              {/* AI Generated Placeholder Image */}
               <div className="relative h-64 w-full bg-muted">
                 <Image
                   src={`https://picsum.photos/seed/${featuredPost.id}/800/400`} // Placeholder image
                   alt={`Featured image for ${featuredPost.title}`}
                   layout="fill"
                   objectFit="cover"
                   data-ai-hint="artificial intelligence technology" // AI hint for image generation
                 />
               </div>
              <CardContent className="pt-4">
                <p className="text-muted-foreground mb-4">{featuredPost.summary}</p>
                <BlogList posts={[featuredPost]} showTitle={false} /> {/* Re-use BlogList for tags/link */}
              </CardContent>
            </Card>
        </section>
      )}


      {/* All Blog Posts Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Latest Posts</h2>
        {loading && posts.length === 0 ? (
           <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 rounded-lg" />)}
           </div>
        ) : (
          <BlogList posts={posts.filter(p => p.id !== featuredPost?.id)} />
        )}
      </section>
    </div>
  );
}
