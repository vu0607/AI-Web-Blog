
'use client';

import { BlogCard } from './BlogCard';
import type { BlogPost } from '@/lib/blog-service'; // Import the type
import { Card, CardContent } from '@/components/ui/card'; // Import Card for no posts message
import { Icons } from '@/components/icons'; // Import Icons

interface BlogListProps {
  posts: BlogPost[];
  showTitle?: boolean; // Optional prop to control title visibility
}

export const BlogList = ({ posts, showTitle = true }: BlogListProps) => {

  if (!posts || posts.length === 0) {
    return (
      <Card className="text-center p-8 border-dashed">
        <CardContent className="flex flex-col items-center gap-4">
          <Icons.fileText className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">No blog posts found.</p>
          {/* Optional: Add a link/button to create a post if in admin context */}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
         // Conditionally render BlogCard or just the link/tags based on showTitle
         showTitle ? <BlogCard key={post.id} post={post} /> : (
            <div key={post.id} className="flex justify-end"> {/* For featured post tags/link */}
               <BlogCard post={post} />
            </div>
         )
      ))}
    </div>
  );
};
