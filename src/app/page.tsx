
import { BlogList } from '@/components/BlogList';

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Welcome to AI Blog Central</h1>
      <BlogList />
    </div>
  );
}
