
import React from 'react';
import { LayoutDashboard, PenTool, BarChart3, TrendingUp, Users, MessageSquare, FolderOpen, Twitter, Instagram, Youtube, Facebook, Music } from 'lucide-react';
import { Post, ContentType, MediaAsset } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'composer', label: 'Composer', icon: <PenTool size={20} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  { id: 'trends', label: 'Trends Explorer', icon: <TrendingUp size={20} /> },
  { id: 'community', label: 'Pro Hub', icon: <Users size={20} /> },
  { id: 'chat', label: 'AI Strategy', icon: <MessageSquare size={20} /> },
  { id: 'files', label: 'File Manager', icon: <FolderOpen size={20} /> },
] as const;

export const PLATFORMS = [
  { id: 'X', label: 'X (Twitter)', icon: <Twitter size={18} />, color: 'bg-black' },
  { id: 'Instagram', label: 'Instagram', icon: <Instagram size={18} />, color: 'bg-pink-600' },
  { id: 'YouTube', label: 'YouTube', icon: <Youtube size={18} />, color: 'bg-red-600' },
  { id: 'TikTok', label: 'TikTok', icon: <Music size={18} />, color: 'bg-purple-600' },
  { id: 'Facebook', label: 'Facebook', icon: <Facebook size={18} />, color: 'bg-blue-600' },
] as const;

const MOCK_AUTHORS = [
  { name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=sarah', isPro: true },
  { name: 'Mike Ross', avatar: 'https://i.pravatar.cc/150?u=mike', isPro: true },
  { name: 'Elena Rodriguez', avatar: 'https://i.pravatar.cc/150?u=elena', isPro: true },
  { name: 'David Chen', avatar: 'https://i.pravatar.cc/150?u=david', isPro: true },
];

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    type: 'reel',
    title: 'AI Future in 60s',
    content: 'Exploring how generative AI changes content creation workflows...',
    platform: 'Instagram',
    engagement: 15400,
    rating: 98,
    postedAt: new Date(Date.now() - 3600000 * 2),
    imageUrl: 'https://picsum.photos/seed/ai/400/600',
    author: MOCK_AUTHORS[0]
  },
  {
    id: '2',
    type: 'text',
    title: 'Morning Motivation',
    content: 'Consistency beats talent when talent doesn\'t work hard.',
    platform: 'X',
    engagement: 8200,
    rating: 95,
    postedAt: new Date(Date.now() - 3600000 * 5),
    author: MOCK_AUTHORS[1]
  }
];

export const INITIAL_ASSETS: MediaAsset[] = [
  {
    id: 'a1',
    name: 'Cyberpunk Cityscape.png',
    type: 'image',
    url: 'https://picsum.photos/seed/cyber/1200/800',
    createdAt: new Date(),
    size: '1.2 MB',
    aspectRatio: '3:2'
  },
  {
    id: 'a2',
    name: 'Lo-fi Study Room.png',
    type: 'image',
    url: 'https://picsum.photos/seed/lofi/1000/1000',
    createdAt: new Date(),
    size: '0.8 MB',
    aspectRatio: '1:1'
  }
];
