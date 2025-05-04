
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BlogPost } from '@/lib/blog-service'; // Import the type
import { Icons } from './icons'; // Import Icons

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Link href={`/blog/${post.id}`} className="group block" legacyBehavior>
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 border border-border/80 hover:border-primary/50">
        {/* AI Generated Placeholder Image */}
        <div className="relative h-48 w-full bg-muted overflow-hidden">
          <Image
            src={`https://picsum.photos/seed/${post.id}/400/200`} // Placeholder image
            alt={`Thumbnail for ${post.title}`}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="blog post abstract" // AI hint for image generation
          />
           {/* Overlay effect on hover (optional) */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <CardHeader>
          <CardTitle className="text-xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
          <CardDescription>
             {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
           </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground text-sm line-clamp-3">{post.summary}</p>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 pt-4">
          {post.tags && post.tags.slice(0, 3).map((tag) => ( // Limit tags shown
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
           <span className="ml-auto text-sm text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             Read More <Icons.arrowRight className="h-4 w-4" />
           </span>
        </CardFooter>
      </Card>
    </Link>
  );
};
