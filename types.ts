
export enum Category {
  ART = 'ART',
  SCIENCE = 'SCIENCE',
  TECHNOLOGY = 'TECHNOLOGY',
  CINEMA = 'CINEMA',
  DESIGN = 'DESIGN',
  FOOD = 'FOOD'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  authorId: string;
  authorName: string;
  category: Category;
  thumbnail: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
  tags: string[];
  attachments: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
