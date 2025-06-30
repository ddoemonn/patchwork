import { v4 as uuidv4 } from 'uuid';
import { Snippet } from '@/types/snippet';

export const createSampleSnippets = (): Snippet[] => {
  const now = new Date();
  
  return [
    {
      id: uuidv4(),
      title: 'React useState Hook',
      description: 'Basic state management in React functional components',
      code: `const [count, setCount] = useState(0);

const increment = () => {
  setCount(count + 1);
};

const decrement = () => {
  setCount(prev => prev - 1);
};`,
      language: 'javascript',
      tags: ['react', 'hooks', 'state'],
      collection: 'React Hooks',
      isFavorite: true,
      isMarkdown: false,
      createdAt: now,
      updatedAt: now,
      history: [],
      isPinned: true,
    },
    {
      id: uuidv4(),
      title: 'Python List Comprehension',
      description: 'Elegant way to create lists in Python',
      code: `# Basic list comprehension
squares = [x**2 for x in range(10)]

# With condition
even_squares = [x**2 for x in range(10) if x % 2 == 0]

# Nested comprehension
matrix = [[i*j for j in range(3)] for i in range(3)]`,
      language: 'python',
      tags: ['python', 'list-comprehension', 'functional'],
      collection: 'Python Basics',
      isFavorite: false,
      isMarkdown: false,
      createdAt: now,
      updatedAt: now,
      history: [],
      isPinned: false,
    },
    {
      id: uuidv4(),
      title: 'CSS Flexbox Center',
      description: 'Center content both horizontally and vertically',
      code: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Alternative with margin auto */
.centered {
  margin: auto;
}`,
      language: 'css',
      tags: ['css', 'flexbox', 'center', 'layout'],
      isFavorite: true,
      isMarkdown: false,
      createdAt: now,
      updatedAt: now,
      history: [],
      isPinned: false,
    },
    {
      id: uuidv4(),
      title: 'Git Common Commands',
      description: 'Most frequently used Git commands for daily workflow',
      code: `# Clone repository
git clone <repository-url>

# Check status
git status

# Add changes
git add .
git add <file-name>

# Commit changes
git commit -m "commit message"

# Push to remote
git push origin main

# Pull latest changes
git pull origin main

# Create and switch to new branch
git checkout -b feature-branch

# Merge branch
git checkout main
git merge feature-branch`,
      language: 'bash',
      tags: ['git', 'version-control', 'commands'],
      collection: 'Git & Version Control',
      isFavorite: false,
      isMarkdown: false,
      createdAt: now,
      updatedAt: now,
      history: [],
      isPinned: false,
    },
    {
      id: uuidv4(),
      title: 'TypeScript Interface Example',
      description: 'Defining interfaces for type safety in TypeScript',
      code: `interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // Optional property
  roles: string[];
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Usage
const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  roles: ["user", "admin"]
};

const response: ApiResponse<User[]> = {
  data: [user],
  status: 200,
  message: "Success"
};`,
      language: 'typescript',
      tags: ['typescript', 'interface', 'types'],
      collection: 'TypeScript',
      isFavorite: true,
      isMarkdown: false,
      createdAt: now,
      updatedAt: now,
      history: [],
      isPinned: false,
    },
    {
      id: uuidv4(),
      title: 'Docker Compose Setup',
      description: 'Basic Docker Compose configuration for web app with database',
      code: `version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
    depends_on:
      - db
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:`,
      language: 'yaml',
      tags: ['docker', 'docker-compose', 'postgres', 'deployment'],
      collection: 'DevOps',
      isFavorite: false,
      isMarkdown: false,
      createdAt: now,
      updatedAt: now,
      history: [],
      isPinned: false,
    },
    {
      id: uuidv4(),
      title: 'SQL Query Examples',
      description: 'Common SQL queries for data analysis and manipulation',
      code: `-- Select with joins
SELECT u.name, p.title, p.created_at
FROM users u
JOIN posts p ON u.id = p.user_id
WHERE u.active = true
ORDER BY p.created_at DESC;

-- Group by with aggregate functions
SELECT category, COUNT(*) as post_count, AVG(views) as avg_views
FROM posts
WHERE created_at >= '2024-01-01'
GROUP BY category
HAVING COUNT(*) > 5;

-- Update with join
UPDATE posts 
SET status = 'featured'
FROM users 
WHERE posts.user_id = users.id 
  AND users.premium = true;

-- Common table expression (CTE)
WITH popular_posts AS (
  SELECT * FROM posts WHERE views > 1000
)
SELECT category, COUNT(*) as popular_count
FROM popular_posts
GROUP BY category;`,
      language: 'sql',
      tags: ['sql', 'database', 'queries', 'joins'],
      collection: 'Database',
      isFavorite: false,
      isMarkdown: false,
      createdAt: now,
      updatedAt: now,
      history: [],
      isPinned: false,
    },
  ];
};

export const loadSampleData = () => {
  if (typeof window === 'undefined') return;
  
  // Check if there are already snippets
  const existingSnippets = localStorage.getItem('patch-work-snippets');
  if (existingSnippets && JSON.parse(existingSnippets).length > 0) {
    return; // Don't overwrite existing data
  }
  
  // Load sample snippets
  const sampleSnippets = createSampleSnippets();
  localStorage.setItem('patch-work-snippets', JSON.stringify(sampleSnippets));
  
  // Also create sample collections
  const sampleCollections = [
    {
      id: uuidv4(),
      name: 'React Hooks',
      description: 'React hooks and patterns',
      color: '#61DAFB',
      snippetIds: [],
      syncEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Python Basics',
      description: 'Essential Python snippets',
      color: '#3776AB',
      snippetIds: [],
      syncEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Git & Version Control',
      description: 'Git commands and workflows',
      color: '#F05032',
      snippetIds: [],
      syncEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'TypeScript',
      description: 'TypeScript examples and patterns',
      color: '#3178C6',
      snippetIds: [],
      syncEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'DevOps',
      description: 'DevOps tools and configurations',
      color: '#FF6B35',
      snippetIds: [],
      syncEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Database',
      description: 'SQL queries and database snippets',
      color: '#336791',
      snippetIds: [],
      syncEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  
  localStorage.setItem('patch-work-collections', JSON.stringify(sampleCollections));
}; 