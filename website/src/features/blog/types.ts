export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
  new?: boolean;
  updated?: boolean;
  category?: string;
  author?: string;
  readTime?: string;
  content?: string[];
};
