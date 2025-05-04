

// Define the structure of a blog post
export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string; // Assuming content is HTML string
  tags: string[];
  date: string; // ISO date string (e.g., '2024-01-01')
}


const BLOG_POSTS_KEY = 'blogPosts';

// Mock data for testing purposes - Conforms to BlogPost type
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of AI',
    summary: 'A brief look into the future of artificial intelligence and its impact on society.',
    content: '<p>AI is set to revolutionize the world as we know it. From autonomous vehicles to personalized medicine, the potential applications are vast. However, ethical considerations and potential job displacement remain significant challenges.</p><h2>Key Areas</h2><ul><li>Natural Language Processing</li><li>Computer Vision</li><li>Reinforcement Learning</li></ul><blockquote>"The development of full artificial intelligence could spell the end of the human race." - Stephen Hawking</blockquote><p>While the future is uncertain, continued research and responsible development are crucial.</p>',
    tags: ['AI', 'Technology', 'Future', 'Ethics'],
    date: '2024-01-01',
  },
  {
    id: '2',
    title: 'Getting Started with Machine Learning',
    summary: 'An introductory guide to machine learning concepts and algorithms for beginners.',
    content: '<p>Machine learning (ML) enables computers to learn from data without being explicitly programmed. This guide covers the basics:</p><h3>Supervised Learning</h3><p>Learning from labeled data (e.g., spam detection).</p><pre><code>def train_model(data, labels):\n  # Training logic here\n  pass</code></pre><h3>Unsupervised Learning</h3><p>Finding patterns in unlabeled data (e.g., clustering).</p><p>Getting started involves choosing a language (like Python), learning libraries (Scikit-learn, TensorFlow), and practicing on datasets.</p>',
    tags: ['Machine Learning', 'Tutorial', 'Beginners', 'Python', 'Data Science'],
    date: '2024-01-05',
  },
  {
    id: '3',
    title: 'Deep Learning Explained',
    summary: 'A deep dive into the concepts and applications of deep learning and neural networks.',
    content: '<p>Deep learning is a subset of machine learning based on artificial neural networks with multiple layers (deep architectures).</p><h3>Core Concepts</h3><ul><li><strong>Neural Networks:</strong> Inspired by the human brain.</li><li><strong>Activation Functions:</strong> Introduce non-linearity (e.g., ReLU).</li><li><strong>Backpropagation:</strong> Algorithm for training networks.</li></ul><h3>Applications</h3><p>Image recognition, natural language processing, game playing (AlphaGo), and more.</p><p>Frameworks like TensorFlow and PyTorch simplify building and training deep learning models.</p>',
    tags: ['Deep Learning', 'Neural Networks', 'AI', 'TensorFlow', 'PyTorch'],
    date: '2024-01-10',
  },
   {
    id: '4',
    title: 'Understanding Natural Language Processing (NLP)',
    summary: 'Exploring how computers process and understand human language.',
    content: '<p>Natural Language Processing (NLP) is a field of AI focused on the interaction between computers and human language. It involves tasks like:</p><ul><li><strong>Tokenization:</strong> Breaking text into words or sentences.</li><li><strong>Part-of-Speech Tagging:</strong> Identifying grammatical roles (noun, verb, etc.).</li><li><strong>Sentiment Analysis:</strong> Determining the emotional tone.</li><li><strong>Machine Translation:</strong> Translating text between languages.</li></ul><p>Techniques range from rule-based systems to complex deep learning models like Transformers.</p>',
    tags: ['NLP', 'AI', 'Language', 'Machine Learning'],
    date: '2024-01-15',
  },
   {
    id: '5',
    title: 'Ethical Considerations in AI Development',
    summary: 'Discussing the important ethical challenges posed by advancing AI technologies.',
    content: '<p>As AI becomes more powerful, ethical considerations are paramount. Key issues include:</p><ul><li><strong>Bias:</strong> AI systems can perpetuate and amplify societal biases present in data.</li><li><strong>Transparency:</strong> Understanding how complex AI models make decisions (explainability).</li><li><strong>Accountability:</strong> Determining responsibility when AI systems cause harm.</li><li><strong>Privacy:</strong> Protecting user data used for training and operation.</li><li><strong>Job Displacement:</strong> The potential impact of automation on employment.</li></ul><p>Developing AI responsibly requires careful design, diverse teams, and ongoing public discourse.</p>',
    tags: ['AI Ethics', 'Responsibility', 'Bias', 'Technology', 'Society'],
    date: '2024-01-20',
  },
];

// Helper function to safely get posts from localStorage
const safelyGetLocalStoragePosts = (): BlogPost[] | null => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null; // Return null if localStorage is not available (SSR or specific environments)
  }
  try {
    const storedPosts = localStorage.getItem(BLOG_POSTS_KEY);
    if (storedPosts) {
       const parsedPosts = JSON.parse(storedPosts);
       // Basic validation to ensure it's an array (can be more robust)
       if (Array.isArray(parsedPosts)) {
          // TODO: Add more thorough validation of each post object if needed
          return parsedPosts as BlogPost[];
       }
    }
    return null; // Return null if nothing stored or invalid format
  } catch (error) {
    console.error("Failed to retrieve or parse blog posts from local storage:", error);
    return null; // Return null on error
  }
};

// Helper function to safely set posts to localStorage
const safelySetLocalStoragePosts = (posts: BlogPost[]) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return; // Do nothing if localStorage is not available
  }
  try {
    localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error("Failed to save blog posts to local storage:", error);
  }
};


// Initialize posts once, prioritizing localStorage, then mock data
let initialPosts: BlogPost[] | null = null;

const initializePosts = (): BlogPost[] => {
   if (initialPosts === null) { // Only initialize once
     const storedPosts = safelyGetLocalStoragePosts();
     if (storedPosts) {
       initialPosts = storedPosts;
     } else {
       initialPosts = mockBlogPosts;
       // Optionally save mock data to localStorage on first load if it was empty
       safelySetLocalStoragePosts(mockBlogPosts);
     }
   }
   // Return a copy to prevent direct mutation of the cached array
   return [...(initialPosts || [])];
};


export const getBlogPosts = (): BlogPost[] => {
  return initializePosts();
};

export const getBlogPost = (id: string): BlogPost | undefined => {
  const posts = initializePosts();
  return posts.find((post) => post.id === id);
};

export const createBlogPost = (post: BlogPost) => {
  const posts = initializePosts();
  const updatedPosts = [...posts, post];
  safelySetLocalStoragePosts(updatedPosts);
  initialPosts = updatedPosts; // Update the cached version
};

export const updateBlogPost = (id: string, updatedPostData: Partial<BlogPost>) => {
  const posts = initializePosts();
  const updatedPosts = posts.map((post) =>
    post.id === id ? { ...post, ...updatedPostData, id: post.id } : post // Ensure ID isn't overwritten if partial update doesn't include it
  );
  safelySetLocalStoragePosts(updatedPosts);
   initialPosts = updatedPosts; // Update the cached version
};

export const deleteBlogPost = (id: string) => {
  const posts = initializePosts();
  const updatedPosts = posts.filter((post) => post.id !== id);
  safelySetLocalStoragePosts(updatedPosts);
   initialPosts = updatedPosts; // Update the cached version
};
