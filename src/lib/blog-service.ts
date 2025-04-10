
const BLOG_POSTS_KEY = 'blogPosts';

// Mock data for testing purposes
const mockBlogPosts = [
  {
    id: '1',
    title: 'The Future of AI',
    summary: 'A brief look into the future of artificial intelligence and its impact on society.',
    content: '<p>AI is set to revolutionize the world as we know it...</p>',
    tags: ['AI', 'Technology', 'Future'],
    date: '2024-01-01',
  },
  {
    id: '2',
    title: 'Getting Started with Machine Learning',
    summary: 'An introductory guide to machine learning for beginners.',
    content: '<p>Machine learning can be easy to learn...</p>',
    tags: ['Machine Learning', 'Tutorial', 'Beginners'],
    date: '2024-01-05',
  },
  {
    id: '3',
    title: 'Deep Learning Explained',
    summary: 'A deep dive into the concepts and applications of deep learning.',
    content: '<p>Deep learning is a subset of machine learning...</p>',
    tags: ['Deep Learning', 'Neural Networks', 'AI'],
    date: '2024-01-10',
  },
];

export const getBlogPosts = () => {
  try {
    const storedPosts = localStorage.getItem(BLOG_POSTS_KEY);
    return storedPosts ? JSON.parse(storedPosts) : mockBlogPosts;
  } catch (error) {
    console.error("Failed to retrieve blog posts from local storage:", error);
    return mockBlogPosts; // Fallback to mock data in case of an error
  }
};

export const getBlogPost = (id: string) => {
  const posts = getBlogPosts();
  return posts.find((post) => post.id === id);
};

export const createBlogPost = (post) => {
  const posts = getBlogPosts();
  localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify([...posts, post]));
};

export const updateBlogPost = (id: string, updatedPost) => {
  const posts = getBlogPosts();
  const updatedPosts = posts.map((post) => (post.id === id ? { ...post, ...updatedPost } : post));
  localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(updatedPosts));
};

export const deleteBlogPost = (id: string) => {
  const posts = getBlogPosts();
  const updatedPosts = posts.filter((post) => post.id !== id);
  localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(updatedPosts));
};
