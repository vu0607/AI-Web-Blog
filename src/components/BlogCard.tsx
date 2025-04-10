
import Link from 'next/link';

export const BlogCard = ({ post }) => {
  return (
    <Link href={`/blog/${post.id}`} className="block rounded-lg border shadow-md p-4 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-600">{post.summary}</p>
      <div className="mt-4">
        {post.tags && post.tags.map((tag) => (
          <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
};
