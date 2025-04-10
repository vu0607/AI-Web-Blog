
import { getBlogPost } from '@/lib/blog-service';
import { CommentSection } from '@/components/CommentSection';

export default function BlogPostPage({ params }) {
  const post = getBlogPost(params.id);

  if (!post) {
    return <div>Blog post not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">{post.title}</h1>
      <p className="text-gray-600 mb-4">Published: {post.date}</p>
      <div className="mb-6">
        {post.tags && post.tags.map((tag) => (
          <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
            #{tag}
          </span>
        ))}
      </div>
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
      <CommentSection />
    </div>
  );
}
