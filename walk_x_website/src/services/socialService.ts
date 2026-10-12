import {
  SocialPost,
  SocialComment,
  SocialUserProfile,
  ActivityType,
  PostVisibility,
  ReportReason
} from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

// Seed Initial WalkX Community Profiles
export const initialSocialProfiles: SocialUserProfile[] = [
  {
    id: 'usr_arjun',
    name: 'Arjun Das',
    username: 'arjun_strides',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Marathon enthusiast & urban explorer. 10k steps before 8 AM every single day 🏃‍♂️✨',
    isPrivate: false,
    city: 'Bengaluru, India',
    followersCount: 1420,
    followingCount: 310,
    postsCount: 28,
    lifetimeSteps: 1845000,
    totalPoints: 18450,
    isFollowing: true,
    followStatus: 'following',
    badgeTitle: 'Century Walker',
    joinDate: 'Jan 2026'
  },
  {
    id: 'usr_ananya',
    name: 'Ananya Iyer',
    username: 'ananya_walks',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    bio: 'Doctor by day, twilight stroller by dusk. Walking for mental clarity & charity causes 🩺🌿',
    isPrivate: false,
    city: 'Chennai, India',
    followersCount: 2890,
    followingCount: 184,
    postsCount: 42,
    lifetimeSteps: 2450000,
    totalPoints: 24500,
    isFollowing: false,
    followStatus: 'none',
    badgeTitle: 'Philanthropy Champion',
    joinDate: 'Nov 2025'
  },
  {
    id: 'usr_rohan_pvt',
    name: 'Rohan Mehra',
    username: 'rohan_trailblazer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'Private account. Mountain hiking & weekend summit trails only. Request to follow 🏔️🔒',
    isPrivate: true,
    city: 'Dehradun, India',
    followersCount: 412,
    followingCount: 195,
    postsCount: 15,
    lifetimeSteps: 980000,
    totalPoints: 9800,
    isFollowing: false,
    followStatus: 'none',
    badgeTitle: 'Alpine Trailblazer',
    joinDate: 'Feb 2026'
  },
  {
    id: 'usr_meera',
    name: 'Meera Kapoor',
    username: 'meera_fit',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Plant mom & morning stride addict. Converted 50k steps into rural education sponsorships 🌱👟',
    isPrivate: false,
    city: 'Mumbai, India',
    followersCount: 3510,
    followingCount: 420,
    postsCount: 56,
    lifetimeSteps: 3120000,
    totalPoints: 31200,
    isFollowing: true,
    followStatus: 'following',
    badgeTitle: 'WalkX Ambassador',
    joinDate: 'Aug 2025'
  }
];

// Seed Initial Social Posts
export const initialSocialPosts: SocialPost[] = [
  {
    id: 'post_101',
    userId: 'usr_arjun',
    userName: 'Arjun Das',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    userBadge: 'Century Walker',
    isPrivateAccount: false,
    caption: 'Broke my personal record this morning with 14,200 continuous strides under the bamboo canopies! 🎋 Air quality was crisp and the stride pace was pure flow.',
    photos: [
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80'
    ],
    activityType: 'Morning Stride',
    metrics: {
      steps: 14210,
      distanceKm: 10.6,
      durationMinutes: 98,
      pointsEarned: 142
    },
    placeTag: {
      name: 'Cubbon Park Botanical Garden',
      city: 'Bengaluru'
    },
    visibility: 'public',
    likesCount: 148,
    isLiked: false,
    commentsCount: 12,
    comments: [
      {
        id: 'cmt_1',
        postId: 'post_101',
        userId: 'usr_meera',
        userName: 'Meera Kapoor',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        text: 'That morning lighting is stunning! What time did you start?',
        createdAt: '2 hours ago'
      },
      {
        id: 'cmt_2',
        postId: 'post_101',
        userId: 'usr_arjun',
        userName: 'Arjun Das',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        text: 'Hit the trail right at 5:45 AM before the city woke up! Highly recommend!',
        createdAt: '1 hour ago'
      }
    ],
    isSaved: false,
    createdAt: '3 hours ago'
  },
  {
    id: 'post_102',
    userId: 'usr_ananya',
    userName: 'Ananya Iyer',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    userBadge: 'Philanthropy Champion',
    isPrivateAccount: false,
    caption: 'Sunset ocean stride along the promenade 🌊 Just pledged today’s 8,500 points towards the Subsidized Dialysis Cause. Every single step counts towards saving lives!',
    photos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'
    ],
    activityType: 'Sunset Walk',
    metrics: {
      steps: 8520,
      distanceKm: 6.4,
      durationMinutes: 65,
      pointsEarned: 85
    },
    placeTag: {
      name: 'Marina Beach Promenade',
      city: 'Chennai'
    },
    visibility: 'public',
    likesCount: 236,
    isLiked: true,
    commentsCount: 18,
    comments: [
      {
        id: 'cmt_3',
        postId: 'post_102',
        userId: 'u_priya',
        userName: 'Priya Sharma',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        text: 'Inspiring as always Ananya! Pledged my weekend strides too ❤️',
        createdAt: '45 mins ago'
      }
    ],
    isSaved: true,
    createdAt: '5 hours ago'
  },
  {
    id: 'post_103',
    userId: 'usr_meera',
    userName: 'Meera Kapoor',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    userBadge: 'WalkX Ambassador',
    isPrivateAccount: false,
    caption: 'Power walking through historic heritage streets before the midday rush. Logged 11.2k steps and redeemed my boAt ANC earbuds from the rewards store today! 🎧🔥',
    photos: [
      'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1000&q=80'
    ],
    activityType: 'Power Walk',
    metrics: {
      steps: 11250,
      distanceKm: 8.2,
      durationMinutes: 84,
      pointsEarned: 112
    },
    placeTag: {
      name: 'Kala Ghoda Art Enclave',
      city: 'Mumbai'
    },
    visibility: 'public',
    likesCount: 312,
    isLiked: false,
    commentsCount: 24,
    comments: [],
    isSaved: false,
    createdAt: '8 hours ago'
  },
  {
    id: 'post_104',
    userId: 'usr_rohan_pvt',
    userName: 'Rohan Mehra',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    userBadge: 'Alpine Trailblazer',
    isPrivateAccount: true,
    caption: 'Secret ridge trail overlook. 16,800 steep elevation steps through the pine mist. Visibility: Followers Only 🌲⛰️',
    photos: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80'
    ],
    activityType: 'Hiking',
    metrics: {
      steps: 16840,
      distanceKm: 12.8,
      durationMinutes: 142,
      pointsEarned: 168
    },
    placeTag: {
      name: 'Benog Wildlife Sanctuary Ridge',
      city: 'Mussoorie'
    },
    visibility: 'followers_only',
    likesCount: 89,
    isLiked: false,
    commentsCount: 6,
    comments: [],
    isSaved: false,
    createdAt: '1 day ago'
  }
];

class SocialService {
  private posts: SocialPost[] = [...initialSocialPosts];
  private profiles: SocialUserProfile[] = [...initialSocialProfiles];
  private reportedPostIds: Set<string> = new Set();
  private blockedUserIds: Set<string> = new Set();
  private userAccountPrivacy: boolean = false; // Current logged-in user privacy

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    try {
      const savedPosts = localStorage.getItem('walkx_social_posts');
      if (savedPosts) {
        this.posts = JSON.parse(savedPosts);
      }
      const savedProfiles = localStorage.getItem('walkx_social_profiles');
      if (savedProfiles) {
        this.profiles = JSON.parse(savedProfiles);
      }
      const pvt = localStorage.getItem('walkx_user_privacy');
      if (pvt !== null) {
        this.userAccountPrivacy = JSON.parse(pvt);
      }
      const savedBlocked = localStorage.getItem('walkx_blocked_users');
      if (savedBlocked) {
        this.blockedUserIds = new Set(JSON.parse(savedBlocked));
      }
    } catch {
      // Fallback
    }
  }

  private persist() {
    try {
      localStorage.setItem('walkx_social_posts', JSON.stringify(this.posts));
      localStorage.setItem('walkx_social_profiles', JSON.stringify(this.profiles));
      localStorage.setItem('walkx_user_privacy', JSON.stringify(this.userAccountPrivacy));
      localStorage.setItem('walkx_blocked_users', JSON.stringify(Array.from(this.blockedUserIds)));
    } catch {
      // Ignore
    }
  }

  /**
   * Get Feed Posts according to active tab and filters
   */
  async getFeed(
    optionsOrTab:
      | 'for_you'
      | 'following'
      | 'saved'
      | 'my_posts'
      | {
          tab?: 'for_you' | 'following' | 'saved' | 'my_posts';
          activityFilter?: string;
          currentUserId?: string;
        } = 'for_you',
    activityFilterArg?: string,
    currentUserIdArg: string = 'curr_user'
  ): Promise<SocialPost[]> {
    let tab: 'for_you' | 'following' | 'saved' | 'my_posts' = 'for_you';
    let activityFilter = activityFilterArg;
    let currentUserId = currentUserIdArg;

    if (typeof optionsOrTab === 'object' && optionsOrTab !== null) {
      tab = optionsOrTab.tab || 'for_you';
      activityFilter = optionsOrTab.activityFilter;
      currentUserId = optionsOrTab.currentUserId || 'curr_user';
    } else if (typeof optionsOrTab === 'string') {
      tab = optionsOrTab;
    }
    // If Supabase live, attempt database query
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('social_posts').select('*').order('created_at', { ascending: false });
        if (activityFilter && activityFilter !== 'All') {
          query = query.eq('activity_type', activityFilter);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          // Merge with local states
          return data.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            userName: d.metrics?.user_name || 'Walker',
            userAvatar: d.metrics?.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            caption: d.caption,
            photos: d.photos || [],
            activityType: d.activity_type as ActivityType,
            metrics: d.metrics,
            placeTag: d.place_tag,
            visibility: d.visibility as PostVisibility,
            likesCount: d.likes_count,
            isLiked: false,
            commentsCount: d.comments_count,
            comments: [],
            isSaved: false,
            createdAt: new Date(d.created_at).toLocaleDateString()
          }));
        }
      } catch {
        // Fallback to local
      }
    }

    // Set of users followed by the current logged-in user
    const followingUserIds = new Set(
      this.profiles.filter((pr) => pr.isFollowing).map((pr) => pr.id)
    );

    // 1. Filter out reported posts and blocked users
    let result = [...this.posts].filter(
      (p) => !this.reportedPostIds.has(p.id) && !this.blockedUserIds.has(p.userId)
    );

    // 2. Protect private posts and private accounts from unauthorized viewers
    result = result.filter((p) => {
      const isAuthor =
        p.userId === currentUserId ||
        p.userId === 'curr_user' ||
        p.userId === 'u_priya' ||
        p.userId === 'self';

      // Author can always see their own posts
      if (isAuthor) return true;

      // Private posts: visible ONLY to author
      if (p.visibility === 'private') return false;

      // Followers-only posts: visible ONLY to confirmed followers
      const isFollower = followingUserIds.has(p.userId);
      if (p.visibility === 'followers_only' && !isFollower) return false;

      // Private account: posts visible ONLY to confirmed followers
      if (p.isPrivateAccount && !isFollower) return false;

      return true;
    });

    // Tab Filters
    if (tab === 'following') {
      result = result.filter((p) => followingUserIds.has(p.userId) || p.userId === currentUserId);
    } else if (tab === 'saved') {
      result = result.filter((p) => p.isSaved);
    } else if (tab === 'my_posts') {
      result = result.filter(
        (p) =>
          p.userId === currentUserId ||
          p.userId === 'curr_user' ||
          p.userId === 'u_priya' ||
          p.userId === 'self'
      );
    }

    // Activity Filter
    if (activityFilter && activityFilter !== 'All') {
      result = result.filter((p) => p.activityType === activityFilter);
    }

    return result;
  }

  /**
   * Create New Social Activity Post
   */
  async createPost(params: {
    caption: string;
    photos: string[];
    activityType: ActivityType;
    metrics?: {
      steps?: number;
      distanceKm?: number;
      durationMinutes?: number;
      pointsEarned?: number;
    };
    placeTag?: {
      name: string;
      city?: string;
    };
    visibility: PostVisibility;
    user: {
      id: string;
      name: string;
      avatarUrl?: string;
      memberTier?: string;
    };
  }): Promise<SocialPost> {
    const newPostId = `post_${Date.now()}`;
    const newPost: SocialPost = {
      id: newPostId,
      userId: params.user.id || 'curr_user',
      userName: params.user.name || 'Priya Sharma',
      userAvatar: params.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      userBadge: params.user.memberTier || 'Gold Walker',
      isPrivateAccount: this.userAccountPrivacy,
      caption: params.caption.trim(),
      photos: params.photos.length > 0 ? params.photos : [
        'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000&q=80'
      ],
      activityType: params.activityType,
      metrics: params.metrics || {
        steps: 5000,
        distanceKm: 3.75,
        durationMinutes: 42,
        pointsEarned: 50
      },
      placeTag: params.placeTag,
      visibility: params.visibility,
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      comments: [],
      isSaved: false,
      createdAt: 'Just now'
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('social_posts').insert({
          id: newPost.id,
          user_id: params.user.id,
          caption: newPost.caption,
          photos: newPost.photos,
          activity_type: newPost.activityType,
          metrics: {
            ...newPost.metrics,
            user_name: newPost.userName,
            user_avatar: newPost.userAvatar
          },
          place_tag: newPost.placeTag,
          visibility: newPost.visibility,
          likes_count: 0,
          comments_count: 0
        });
      } catch {
        // Fallback
      }
    }

    this.posts = [newPost, ...this.posts];
    this.persist();
    return newPost;
  }

  /**
   * Toggle Like on Post
   */
  async toggleLike(postId: string, userId: string = 'curr_user'): Promise<{ isLiked: boolean; likesCount: number }> {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    post.isLiked = !post.isLiked;
    post.likesCount = post.isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1);

    if (isSupabaseConfigured && supabase) {
      try {
        if (post.isLiked) {
          await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });
        } else {
          await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', userId);
        }
      } catch {
        // Fallback
      }
    }

    this.persist();
    return { isLiked: post.isLiked, likesCount: post.likesCount };
  }

  /**
   * Add Comment to Post
   */
  async addComment(
    postId: string,
    text: string,
    user: { id: string; name: string; avatarUrl?: string }
  ): Promise<SocialComment> {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    const newComment: SocialComment = {
      id: `cmt_${Date.now()}`,
      postId,
      userId: user.id || 'curr_user',
      userName: user.name || 'Priya Sharma',
      userAvatar: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      text: text.trim(),
      createdAt: 'Just now'
    };

    post.comments = [...post.comments, newComment];
    post.commentsCount = post.comments.length;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('post_comments').insert({
          id: newComment.id,
          post_id: postId,
          user_id: user.id,
          text: newComment.text
        });
      } catch {
        // Fallback
      }
    }

    this.persist();
    return newComment;
  }

  /**
   * Toggle Save / Bookmark
   */
  async toggleSave(postId: string, userId: string = 'curr_user'): Promise<boolean> {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    post.isSaved = !post.isSaved;

    if (isSupabaseConfigured && supabase) {
      try {
        if (post.isSaved) {
          await supabase.from('post_saves').insert({ post_id: postId, user_id: userId });
        } else {
          await supabase.from('post_saves').delete().eq('post_id', postId).eq('user_id', userId);
        }
      } catch {
        // Fallback
      }
    }

    this.persist();
    return post.isSaved;
  }

  /**
   * Report Post (Content Moderation)
   */
  async reportPost(
    postId: string,
    reason: ReportReason,
    details?: string,
    reporterId: string = 'curr_user'
  ): Promise<boolean> {
    this.reportedPostIds.add(postId);
    const post = this.posts.find((p) => p.id === postId);
    if (post) post.isReported = true;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('post_reports').insert({
          id: `rep_${Date.now()}`,
          post_id: postId,
          reporter_id: reporterId,
          reason,
          details: details || ''
        });
      } catch {
        // Fallback
      }
    }

    this.persist();
    return true;
  }

  /**
   * Toggle Follow User
   */
  async toggleFollow(targetUserId: string): Promise<SocialUserProfile> {
    const profile = this.profiles.find((pr) => pr.id === targetUserId);
    if (!profile) throw new Error('User profile not found');

    if (profile.isFollowing) {
      profile.isFollowing = false;
      profile.followStatus = 'none';
      profile.followersCount = Math.max(0, profile.followersCount - 1);
    } else {
      if (profile.isPrivate) {
        profile.followStatus = 'requested';
      } else {
        profile.isFollowing = true;
        profile.followStatus = 'following';
        profile.followersCount += 1;
      }
    }

    this.persist();
    return { ...profile };
  }

  /**
   * Get User Profile by ID or username
   */
  async getUserProfile(userIdOrUsername: string): Promise<SocialUserProfile | null> {
    const found = this.profiles.find(
      (pr) => pr.id === userIdOrUsername || pr.username.toLowerCase() === userIdOrUsername.toLowerCase()
    );
    return found ? { ...found } : null;
  }

  /**
   * Get All Community Profiles (for Suggested / Explore)
   */
  async getAllProfiles(): Promise<SocialUserProfile[]> {
    return [...this.profiles];
  }

  /**
   * Edit / Update Post (Author only)
   */
  async updatePost(
    postId: string,
    updates: {
      caption?: string;
      activityType?: ActivityType;
      placeTag?: { name: string; city?: string };
      visibility?: PostVisibility;
    }
  ): Promise<SocialPost> {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    if (updates.caption !== undefined) post.caption = updates.caption;
    if (updates.activityType !== undefined) post.activityType = updates.activityType;
    if (updates.placeTag !== undefined) post.placeTag = updates.placeTag;
    if (updates.visibility !== undefined) post.visibility = updates.visibility;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('social_posts')
          .update({
            caption: post.caption,
            activity_type: post.activityType,
            place_tag: post.placeTag,
            visibility: post.visibility
          })
          .eq('id', postId);
      } catch {
        // Fallback
      }
    }

    this.persist();
    return { ...post };
  }

  /**
   * Delete Post (Author only)
   */
  async deletePost(postId: string): Promise<boolean> {
    const prevCount = this.posts.length;
    this.posts = this.posts.filter((p) => p.id !== postId);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('social_posts').delete().eq('id', postId);
      } catch {
        // Fallback
      }
    }

    this.persist();
    return this.posts.length < prevCount;
  }

  /**
   * Block User (hide their strides and prevent interactions)
   */
  async blockUser(targetUserId: string): Promise<boolean> {
    this.blockedUserIds.add(targetUserId);
    this.persist();
    return true;
  }

  /**
   * Unblock User
   */
  async unblockUser(targetUserId: string): Promise<boolean> {
    this.blockedUserIds.delete(targetUserId);
    this.persist();
    return true;
  }

  isUserBlocked(userId: string): boolean {
    return this.blockedUserIds.has(userId);
  }

  getBlockedUsers(): string[] {
    return Array.from(this.blockedUserIds);
  }

  /**
   * Get Posts by User ID with privacy protection
   */
  async getUserPosts(userId: string, viewerId: string = 'curr_user'): Promise<SocialPost[]> {
    // If user is blocked, return empty
    if (this.blockedUserIds.has(userId)) return [];

    const isAuthor = userId === viewerId || viewerId === 'curr_user' || userId === 'self';
    const profile = this.profiles.find((pr) => pr.id === userId);
    const isFollower = profile?.isFollowing ?? false;

    // If account is private and viewer is not following and not self -> protect private posts!
    if (profile?.isPrivate && !isFollower && !isAuthor) {
      return [];
    }

    return this.posts.filter((p) => {
      if (p.userId !== userId) return false;
      if (this.reportedPostIds.has(p.id)) return false;
      if (this.blockedUserIds.has(p.userId)) return false;

      // Privacy protection for non-authors
      if (!isAuthor) {
        if (p.visibility === 'private') return false;
        if (p.visibility === 'followers_only' && !isFollower) return false;
        if (p.isPrivateAccount && !isFollower) return false;
      }

      return true;
    });
  }

  /**
   * Account Privacy Toggle (Public vs Private account)
   */
  async setAccountPrivacy(isPrivate: boolean): Promise<boolean> {
    this.userAccountPrivacy = isPrivate;
    this.persist();
    return this.userAccountPrivacy;
  }

  getAccountPrivacy(): boolean {
    return this.userAccountPrivacy;
  }

  /**
   * Synchronize profile edits with social state
   */
  async updateCurrentUserProfile(profileData: {
    name?: string;
    username?: string;
    bio?: string;
    city?: string;
    avatar?: string;
    isPrivate?: boolean;
  }): Promise<void> {
    if (profileData.isPrivate !== undefined) {
      this.userAccountPrivacy = profileData.isPrivate;
    }

    // Update existing posts by current user with updated name/avatar
    this.posts = this.posts.map((p) => {
      if (p.userId === 'curr_user' || p.userId === 'u_priya' || p.userId === 'self') {
        return {
          ...p,
          userName: profileData.name || p.userName,
          userAvatar: profileData.avatar || p.userAvatar,
          isPrivateAccount:
            profileData.isPrivate !== undefined ? profileData.isPrivate : p.isPrivateAccount
        };
      }
      return p;
    });

    this.persist();
  }
}

export const socialService = new SocialService();
