
import React from 'react';
import { Category, Post } from './types';

export const CATEGORIES = Object.values(Category);

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'The Future of Generative Art',
    excerpt: 'Exploring how AI is reshaping the boundaries of human creativity and artistic expression.',
    content: 'Generative art is not new, but the tools we have today are beyond imagination. AI models can now produce works that challenge our perception of "human" touch...',
    authorId: 'user_1',
    authorName: 'Alex Rivera',
    category: Category.ART,
    thumbnail: 'https://picsum.photos/800/600?random=1',
    createdAt: '2024-05-15T10:00:00Z',
    likes: 42,
    comments: [],
    tags: ['AI', 'Creativity', 'Future'],
    attachments: []
  },
  {
    id: '2',
    title: 'Sustainable Architecture in Urban Spaces',
    excerpt: 'How green buildings are becoming the heartbeat of modern city planning.',
    content: 'Vertical forests and solar-glass windows are no longer science fiction. Modern architects are integrating living ecosystems into high-rise buildings...',
    authorId: 'user_2',
    authorName: 'Elena Woods',
    category: Category.DESIGN,
    thumbnail: 'https://picsum.photos/800/600?random=2',
    createdAt: '2024-05-14T08:30:00Z',
    likes: 28,
    comments: [],
    tags: ['Green', 'City', 'Sustainability'],
    attachments: []
  },
  {
    id: '3',
    title: 'Quantum Computing: A New Frontier',
    excerpt: 'Deep diving into the world of qubits and the future of computational power.',
    content: 'Unlike classical bits, qubits can exist in a superposition of states. This enables a leap in processing power that could solve humanity’s toughest problems...',
    authorId: 'user_3',
    authorName: 'Dr. Julian Thorne',
    category: Category.SCIENCE,
    thumbnail: 'https://picsum.photos/800/600?random=3',
    createdAt: '2024-05-13T12:45:00Z',
    likes: 115,
    comments: [],
    tags: ['Physics', 'Quantum', 'Computing'],
    attachments: []
  }
];
