
export type ContentType = 'text' | 'reel' | 'vlog';

export interface Post {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  platform: 'X' | 'Instagram' | 'YouTube' | 'TikTok' | 'Facebook';
  engagement: number;
  rating: number; // 0-100
  postedAt: Date;
  scheduledAt?: Date;
  imageUrl?: string;
  author?: {
    name: string;
    avatar: string;
    isPro: boolean;
  };
}

export interface MediaAsset {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
  createdAt: Date;
  size?: string;
  aspectRatio?: string;
}

export interface Trend {
  tag: string;
  volume: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sources?: string[];
}

export type ViewState = 'dashboard' | 'composer' | 'analytics' | 'trends' | 'community' | 'chat' | 'files';
