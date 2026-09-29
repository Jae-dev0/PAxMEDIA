// ─── User ───────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  banner?: string;
  bio: string;
  karma: number;
  followersCount: number;
  followingCount: number;
  joinedAt: string;
  isOnline: boolean;
  isVerified: boolean;
  role: 'user' | 'moderator' | 'admin';
}

// ─── Community ──────────────────────────────────────────────────────────────
export interface Community {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  banner: string;
  membersCount: number;
  onlineCount: number;
  createdAt: string;
  category: string;
  rules: CommunityRule[];
  moderators: string[];
  isJoined: boolean;
  isFollowing: boolean;
}

export interface CommunityRule {
  id: string;
  title: string;
  description: string;
}

// ─── Post ───────────────────────────────────────────────────────────────────
export type PostType = 'text' | 'image' | 'gallery' | 'video' | 'link' | 'poll';

export interface Post {
  id: string;
  communityId: string;
  communityName: string;
  communitySlug: string;
  communityIcon: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole?: 'moderator' | 'admin';
  title: string;
  body: string;
  type: PostType;
  media: PostMedia[];
  link?: string;
  poll?: Poll;
  flair?: string;
  flairColor?: string;
  score: number;
  userVote: 1 | -1 | 0;
  commentsCount: number;
  repostsCount: number;
  isReposted: boolean;
  createdAt: string;
  isSaved: boolean;
  isHidden: boolean;
  isSpoiler: boolean;
  isNSFW: boolean;
  isPinned: boolean;
  isLocked: boolean;
}

export interface PostMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  width?: number;
  height?: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  endsAt: string;
  userVote?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

// ─── Comment ────────────────────────────────────────────────────────────────
export interface Comment {
  id: string;
  postId: string;
  parentId: string | null;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole?: 'moderator' | 'admin';
  body: string;
  score: number;
  userVote: 1 | -1 | 0;
  createdAt: string;
  isEdited: boolean;
  isCollapsed: boolean;
  replies: Comment[];
  depth: number;
}

// ─── Notification ───────────────────────────────────────────────────────────
export type NotificationType =
  | 'comment_reply'
  | 'post_reply'
  | 'mention'
  | 'upvote'
  | 'follower'
  | 'community'
  | 'message'
  | 'moderation';

export interface Notification {
  id: string;
  type: NotificationType;
  actorId: string;
  actorName: string;
  actorAvatar: string;
  message: string;
  postId?: string;
  commentId?: string;
  communityId?: string;
  isRead: boolean;
  createdAt: string;
}

// ─── Message ────────────────────────────────────────────────────────────────
export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  body: string;
  attachments: MessageAttachment[];
  isRead: boolean;
  createdAt: string;
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file';
  url: string;
  name: string;
}

// ─── Search ─────────────────────────────────────────────────────────────────
export type SearchResultType = 'post' | 'community' | 'user' | 'comment';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  avatar?: string;
  communityName?: string;
  score: number;
  createdAt: string;
}

// ─── Moderation ─────────────────────────────────────────────────────────────
export interface Report {
  id: string;
  type: 'post' | 'comment' | 'user' | 'community';
  targetId: string;
  targetTitle: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  status: 'pending' | 'approved' | 'removed' | 'dismissed';
  moderatorId?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface Ban {
  id: string;
  userId: string;
  username: string;
  reason: string;
  moderatorId: string;
  moderatorName: string;
  communityId?: string;
  communityName?: string;
  isPermanent: boolean;
  expiresAt?: string;
  createdAt: string;
}

// ─── Pagination ─────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

// ─── Query Params ───────────────────────────────────────────────────────────
export interface PostQuery {
  page?: number;
  perPage?: number;
  sort?: 'hot' | 'new' | 'top' | 'rising';
  communityId?: string;
  userId?: string;
  type?: PostType;
}

export interface CommentQuery {
  postId: string;
  sort?: 'best' | 'top' | 'newest' | 'oldest' | 'controversial';
  page?: number;
  perPage?: number;
}

export interface SearchQuery {
  q: string;
  type?: SearchResultType;
  sort?: 'relevance' | 'newest' | 'popular';
  timeRange?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
  communityId?: string;
  page?: number;
  perPage?: number;
}
