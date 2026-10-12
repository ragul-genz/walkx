import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Lock,
  Globe,
  MapPin,
  Calendar,
  Footprints,
  Grid,
  ListFilter,
  Share2,
  Check,
  ShieldCheck,
  Heart,
  MessageCircle
} from 'lucide-react';
import {
  SocialUserProfile,
  SocialPost,
  UserProfile,
  ReportReason
} from '../types';
import { socialService } from '../services/socialService';
import { PostCard } from '../components/social/PostCard';
import { ReportPostModal } from '../components/social/ReportPostModal';

interface UserProfilePageProps {
  userId: string;
  currentUser: UserProfile;
  onBack: () => void;
  onViewProfile: (userId: string) => void;
  showToast: (msg: string) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  userId,
  currentUser,
  onBack,
  onViewProfile,
  showToast
}) => {
  const [profile, setProfile] = useState<SocialUserProfile | null>(null);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [activeView, setActiveView] = useState<'feed' | 'grid'>('feed');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [reportingPost, setReportingPost] = useState<{ id: string; authorName: string } | null>(null);

  // Check if viewing own profile
  const isSelf = profile?.id === currentUser.id || profile?.id === 'curr_user' || userId === 'self';

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const data = await socialService.getUserProfile(userId);
      if (data) {
        setProfile(data);
        const userPosts = await socialService.getUserPosts(data.id);
        setPosts(userPosts);
      } else {
        // Fallback profile if not found
        const fallback: SocialUserProfile = {
          id: userId,
          name: 'WalkX Walker',
          username: `walker_${userId.slice(0, 5)}`,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          bio: 'Passionate step counter and daily walker on WalkX.',
          isPrivate: false,
          city: 'India',
          followersCount: 120,
          followingCount: 45,
          postsCount: 1,
          lifetimeSteps: 450000,
          totalPoints: 4500,
          isFollowing: false,
          followStatus: 'none',
          badgeTitle: 'Active Walker',
          joinDate: 'Jan 2026'
        };
        setProfile(fallback);
        const userPosts = await socialService.getUserPosts(userId);
        setPosts(userPosts);
      }
    } catch {
      showToast('Could not load walker profile.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [userId]);

  // Handle follow / unfollow toggle
  const handleFollowToggle = async () => {
    if (!profile) return;
    try {
      const updated = await socialService.toggleFollow(profile.id);
      setProfile(updated);
      if (updated.followStatus === 'following') {
        showToast(`Now following ${updated.name}!`);
      } else if (updated.followStatus === 'requested') {
        showToast(`Follow request sent to ${updated.name} (Private Account).`);
      } else {
        showToast(`Unfollowed ${updated.name}.`);
      }
    } catch {
      showToast('Failed to change follow status.');
    }
  };

  // Like
  const handleLike = async (postId: string) => {
    try {
      await socialService.toggleLike(postId, currentUser.id || 'curr_user');
    } catch {
      showToast('Like failed.');
    }
  };

  // Save
  const handleSave = async (postId: string) => {
    try {
      const saved = await socialService.toggleSave(postId, currentUser.id || 'curr_user');
      showToast(saved ? 'Post saved!' : 'Post removed from saved.');
    } catch {
      showToast('Save failed.');
    }
  };

  // Comment
  const handleComment = async (postId: string, text: string) => {
    try {
      const comment = await socialService.addComment(postId, text, {
        id: currentUser.id || 'curr_user',
        name: currentUser.name || 'Priya Sharma',
        avatarUrl: currentUser.avatarUrl
      });
      showToast('Comment added!');
      return comment;
    } catch {
      showToast('Comment failed.');
    }
  };

  // Report
  const handleConfirmReport = async (reason: ReportReason, details?: string) => {
    if (!reportingPost) return;
    try {
      await socialService.reportPost(reportingPost.id, reason, details, currentUser.id || 'curr_user');
      setPosts((prev) => prev.filter((p) => p.id !== reportingPost.id));
      showToast('Stride has been reported and hidden.');
    } catch {
      showToast('Report failed.');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast('Profile link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-[#060913] text-white flex flex-col items-center justify-center p-6">
        <Footprints size={40} className="text-[#4B4DFF] animate-pulse mb-3" />
        <p className="text-sm text-slate-400">Loading walker profile...</p>
      </div>
    );
  }

  // Check if content is locked (Private account & not followed & not self)
  const isLocked = profile.isPrivate && !profile.isFollowing && !isSelf;

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Actions Top Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:border-[#4B4DFF] transition-all"
          >
            <ArrowLeft size={14} />
            <span>Back to Feed</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
            <span>{copied ? 'Copied' : 'Share Profile'}</span>
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="bg-[#0b0e24] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
          {/* Banner Graphic */}
          <div className="h-44 sm:h-52 w-full bg-gradient-to-r from-indigo-900 via-purple-900 to-[#1e1b4b] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-40" />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 backdrop-blur-md ${
                  profile.isPrivate
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {profile.isPrivate ? <Lock size={12} /> : <Globe size={12} />}
                <span>{profile.isPrivate ? 'Private Profile' : 'Public Profile'}</span>
              </span>
            </div>
          </div>

          {/* Profile Details Container */}
          <div className="px-6 pb-6 pt-0 relative">
            {/* Avatar & Action Button Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-5">
              <div className="relative inline-block">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-[#0b0e24] shadow-2xl bg-slate-800"
                />
                <div
                  title="Verified Walker"
                  className="absolute bottom-1 right-1 w-7 h-7 rounded-xl bg-[#4B4DFF] border-2 border-[#0b0e24] flex items-center justify-center text-white shadow-md"
                >
                  <ShieldCheck size={15} />
                </div>
              </div>

              {!isSelf && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFollowToggle}
                    className={`px-6 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md ${
                      profile.followStatus === 'following'
                        ? 'bg-slate-800 text-slate-300 border border-white/10 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30'
                        : profile.followStatus === 'requested'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'gradient-btn text-white shadow-[0_0_15px_rgba(75,77,255,0.4)]'
                    }`}
                  >
                    {profile.followStatus === 'following'
                      ? 'Following'
                      : profile.followStatus === 'requested'
                      ? 'Request Sent'
                      : '+ Follow Walker'}
                  </button>
                </div>
              )}
            </div>

            {/* Name & Bio */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
                  {profile.name}
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {profile.badgeTitle}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">@{profile.username}</p>

              <p className="text-xs sm:text-sm text-slate-300 mt-3 max-w-2xl leading-relaxed">
                {profile.bio}
              </p>

              {/* Meta pills */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-400">
                {profile.city && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-rose-400" />
                    <span>{profile.city}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-indigo-400" />
                  <span>Joined {profile.joinDate}</span>
                </div>
              </div>
            </div>

            {/* Lifetime Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-white/10">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/05 text-center">
                <span className="text-lg font-black text-white block">
                  {profile.postsCount}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Strides</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/05 text-center">
                <span className="text-lg font-black text-white block">
                  {profile.followersCount.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Followers</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/05 text-center">
                <span className="text-lg font-black text-white block">
                  {profile.followingCount.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Following</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/05 text-center col-span-1 sm:col-span-1">
                <span className="text-lg font-black text-cyan-400 block">
                  {(profile.lifetimeSteps / 1000).toFixed(0)}k
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Lifetime Steps</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/05 text-center col-span-2 sm:col-span-1">
                <span className="text-lg font-black text-amber-400 block">
                  {profile.totalPoints.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">WalkX Points</span>
              </div>
            </div>
          </div>
        </div>

        {/* Locked Private Account State */}
        {isLocked ? (
          <div className="bg-[#0b0e24] border border-white/10 rounded-3xl p-10 sm:p-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
              <Lock size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">This Account is Private</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
              @{profile.username} has set their profile visibility to private. Follow this walker to see their photos, routes, step metrics, and daily community achievements.
            </p>
            <button
              onClick={handleFollowToggle}
              className={`px-6 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                profile.followStatus === 'requested'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'gradient-btn text-white shadow-lg'
              }`}
            >
              {profile.followStatus === 'requested' ? 'Follow Request Pending' : 'Request to Follow'}
            </button>
          </div>
        ) : (
          /* Unlocked Content View */
          <div className="space-y-6">
            {/* View Switcher: Feed Stream vs Photo Grid */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('feed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeView === 'feed'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ListFilter size={14} />
                  <span>Timeline Strides</span>
                </button>
                <button
                  onClick={() => setActiveView('grid')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeView === 'grid'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Grid size={14} />
                  <span>Photo Grid</span>
                </button>
              </div>

              <span className="text-xs text-slate-400 font-medium">
                {posts.length} {posts.length === 1 ? 'stride shared' : 'strides shared'}
              </span>
            </div>

            {posts.length === 0 ? (
              <div className="bg-[#0b0e24] border border-white/10 rounded-2xl p-10 text-center text-slate-400">
                <Footprints size={32} className="mx-auto text-indigo-400 mb-2 opacity-60" />
                <p className="text-sm font-semibold text-slate-300">No strides published yet</p>
                <p className="text-xs mt-1">This walker hasn’t shared any public activity logs yet.</p>
              </div>
            ) : activeView === 'feed' ? (
              /* Feed View */
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onSave={handleSave}
                    onComment={handleComment}
                    onReport={(id, authorName) => setReportingPost({ id, authorName })}
                    onViewProfile={onViewProfile}
                    currentUserId={currentUser.id || 'curr_user'}
                  />
                ))}
              </div>
            ) : (
              /* Photo Grid View */
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {posts.map((post) => {
                  const cover = post.photos[0] || 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000&q=80';
                  return (
                    <div
                      key={post.id}
                      onClick={() => setActiveView('feed')}
                      className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-white/10 cursor-pointer"
                    >
                      <img
                        src={cover}
                        alt={post.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <p className="text-xs text-white font-medium line-clamp-2 mb-2">
                          {post.caption}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-white/90">
                          <span className="flex items-center gap-1">
                            <Heart size={12} className="fill-white" />
                            {post.likesCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle size={12} />
                            {post.commentsCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Report Modal */}
      {reportingPost && (
        <ReportPostModal
          isOpen={!!reportingPost}
          onClose={() => setReportingPost(null)}
          postId={reportingPost.id}
          authorName={reportingPost.authorName}
          onConfirmReport={handleConfirmReport}
        />
      )}
    </div>
  );
};
