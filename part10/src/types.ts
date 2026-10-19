export type PageInfo = {
  endCursor: string | null;
  hasNextPage: boolean;
};

export type Repository = {
  id: string;
  fullName: string;
  description: string | null;
  language: string | null;
  forksCount: number | null;
  stargazersCount: number | null;
  ratingAverage: number;
  reviewCount: number;
  ownerAvatarUrl: string | null;
  url: string | null;
};

export type Review = {
  id: string;
  text: string | null;
  rating: number;
  createdAt: string;
  user: {
    id: string;
    username: string;
  };
  repository: Repository;
};

export type ReviewConnection = {
  edges: { cursor: string; node: Review }[];
  pageInfo: PageInfo;
  totalCount: number;
};
