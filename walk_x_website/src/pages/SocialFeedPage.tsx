import React, { useState, useEffect } from 'react';
import {
  Users,
  PlusCircle,
  Sparkles,
  Lock,
  Globe,
  Compass,
  Bookmark,
  UserCheck,
  TrendingUp,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  SocialPost,
  SocialUserProfile,
  ActivityType,
  UserProfile,
  ReportReason
} from '../types';
import { socialService } from '../services/socialService';
import { PostCard } from '../components/social/PostCard';
import { CreatePostModal } from '../components/social/CreatePostModal';
import { ReportPostModal } from '../components/social/ReportPostModal';

interface SocialFeedPageProps {
  user: UserProfile;
  onViewProfile: (userId: string) => void;
  showToast: (msg: string) => void;
}

const ACTIVITY_FILTERS: (ActivityType | 'All')[] = [
  'All',
  'Morning Stride',
  'Sunset Walk',
  'Power Walk',
  'Hiking',
  'Jogging',
  'Nature Trail',
  'Charity Walk'
];

export const SocialFeedPage: React.FC<SocialFeedPageProps> = ({
  user,
  onViewProfile,
  showToast
}) => {
  // Feed State
  const [activeTab, setActiveTab] = useState<'for_you' | 'following' | 'saved' | 'my_posts'>('for_you');
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [suggestedProfiles, setSuggestedProfiles] = useState<SocialUserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Privacy
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [reportingPost, setReportingPost] = useState<{ id: string; authorName: string } | null>(null);
  const [isPrivateAccount, setIsPrivateAccount] = useState<boolean>(() => socialService.getAccountPrivacy());

  // Load feed and community profiles
  const loadFeedData = async () => {
    setIsLoading(true);
    try {
      const feedPosts = await socialService.getFeed({
        tab: activeTab,
        activityFilter: selectedActivity,
        currentUserId: user.id || 'curr_user'
      });
      setPosts(feedPosts);

      const allProfiles = await socialService.getAllProfiles();
      setSuggestedProfiles(allProfiles);
    } catch {
      showToast('Could not refresh social feed.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeedData();
  }, [activeTab, selectedActivity]);

  // Handle privacy toggle
  const handleTogglePrivacy = async () => {
    const nextPrivacy = !isPrivateAccount;
    setIsPrivateAccount(nextPrivacy);
    await socialService.setAccountPrivacy(nextPrivacy);
    showToast(
      nextPrivacy
        ? 'Account set to Private. Only approved followers can view your strides.'
        : 'Account is now Public. Anyone can view your walks and cheer you on!'
    );
  };

  // Follow/unfollow in suggested walkers sidebar
  const handleFollowToggle = async (profileId: string) => {
    try {
      const updated = await socialService.toggleFollow(profileId);
      setSuggestedProfiles((prev) =>
        prev.map((p) => (p.id === profileId ? updated : p))
      );
      if (updated.followStatus === 'following') {
        showToast(`Now following ${updated.name}!`);
        // If on following tab, reload feed
        if (activeTab === 'following') {
          loadFeedData();
        }
      } else if (updated.followStatus === 'requested') {
        showToast(`Follow request sent to ${updated.name} (Private Account).`);
      } else {
        showToast(`Unfollowed ${updated.name}.`);
        if (activeTab === 'following') {
          loadFeedData();
        }
      }
    } catch {
      showToast('Action could not be completed.');
    }
  };

  // Like action
  const handleLike = async (postId: string) => {
    try {
      await socialService.toggleLike(postId, user.id || 'curr_user');
    } catch {
      showToast('Unable to update like.');
    }
  };

  // Save action
  const handleSave = async (postId: string) => {
    try {
      const saved = await socialService.toggleSave(postId, user.id || 'curr_user');
      showToast(saved ? 'Post saved to your bookmarks!' : 'Post removed from saved.');
      if (activeTab === 'saved') {
        setPosts((prev) => prev.filter((p) => (p.id === postId ? saved : true)));
      }
    } catch {
      showToast('Unable to bookmark post.');
    }
  };

  // Comment action
  const handleComment = async (postId: string, text: string) => {
    try {
      const comment = await socialService.addComment(postId, text, {
        id: user.id || 'curr_user',
        name: user.name || 'Priya Sharma',
        avatarUrl: user.avatarUrl
      });
      showToast('Comment posted!');
      return comment;
    } catch {
      showToast('Failed to post comment.');
    }
  };

  // Report post confirmation
  const handleConfirmReport = async (reason: ReportReason, details?: string) => {
    if (!reportingPost) return;
    try {
      await socialService.reportPost(reportingPost.id, reason, details, user.id || 'curr_user');
      setPosts((prev) => prev.filter((p) => p.id !== reportingPost.id));
      showToast('Thank you. The reported stride has been hidden and submitted to moderators.');
    } catch {
      showToast('Report failed. Please try again.');
    }
  };

  // Filter posts by search query if any
  const displayedPosts = searchQuery.trim()
    ? posts.filter(
        (p) =>
          p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.activityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.placeTag?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Header & Quick Action Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
              <Sparkles size={13} className="text-indigo-400 animate-pulse" />
              <span>WalkX Community Strides</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-['Outfit'] text-white">
              Social Activity Feed
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              High-five milestones, explore scenic neighborhood routes, and share your genuine walking telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="gradient-btn px-5 py-3 rounded-2xl font-bold text-sm text-white flex items-center gap-2 shadow-[0_0_20px_rgba(75,77,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <PlusCircle size={18} />
              <span>Share Your Stride</span>
            </button>
          </div>
        </div>

        {/* Account Privacy Setting Status Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 to-[#0c102a] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isPrivateAccount
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {isPrivateAccount ? <Lock size={20} /> : <Globe size={20} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  Account Privacy: {isPrivateAccount ? 'Private Account' : 'Public Account'}
                </span>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    isPrivateAccount
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                  }`}
                >
                  {isPrivateAccount ? 'Followers Only' : 'Community Visible'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isPrivateAccount
                  ? 'Only walkers you approve can view your strides, telemetry metrics, and profile posts.'
                  : 'Your strides appear in the global "For You" feed and can inspire any community walker.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleTogglePrivacy}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
              isPrivateAccount
                ? 'bg-slate-800 text-slate-200 border-white/10 hover:border-emerald-500/40'
                : 'bg-slate-800 text-slate-200 border-white/10 hover:border-amber-500/40'
            }`}
          >
            {isPrivateAccount ? 'Make Account Public' : 'Switch to Private'}
          </button>
        </div>

        {/* Main Grid: Feed + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Feed Column */}
          <div className="lg:col-span-8 space-y-5">
            {/* Nav Tabs & Search bar */}
            <div className="bg-[#0b0e24] border border-white/10 rounded-2xl p-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Tab Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  onClick={() => setActiveTab('for_you')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'for_you'
                      ? 'bg-[#4B4DFF] text-white shadow-[0_0_12px_rgba(75,77,255,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Compass size={14} />
                  <span>For You</span>
                </button>

                <button
                  onClick={() => setActiveTab('following')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'following'
                      ? 'bg-[#4B4DFF] text-white shadow-[0_0_12px_rgba(75,77,255,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <UserCheck size={14} />
                  <span>Following</span>
                </button>

                <button
                  onClick={() => setActiveTab('saved')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'saved'
                      ? 'bg-[#4B4DFF] text-white shadow-[0_0_12px_rgba(75,77,255,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Bookmark size={14} />
                  <span>Saved</span>
                </button>

                <button
                  onClick={() => setActiveTab('my_posts')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'my_posts'
                      ? 'bg-[#4B4DFF] text-white shadow-[0_0_12px_rgba(75,77,255,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <TrendingUp size={14} />
                  <span>My Strides</span>
                </button>
              </div>

              {/* Search input */}
              <div className="relative min-w-[200px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter strides, places, walkers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4B4DFF]"
                />
              </div>
            </div>

            {/* Activity Type Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 shrink-0 pl-1">
                <Filter size={12} />
                Activity:
              </span>
              {ACTIVITY_FILTERS.map((act) => {
                const active = selectedActivity === act;
                return (
                  <button
                    key={act}
                    onClick={() => setSelectedActivity(act)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                      active
                        ? 'bg-gradient-to-r from-[#4B4DFF] to-[#6D3DFF] text-white font-semibold shadow-sm'
                        : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] border border-white/[0.06]'
                    }`}
                  >
                    {act}
                  </button>
                );
              })}
            </div>

            {/* Quick Composer Prompt on Top of Feed */}
            <div className="bg-[#0b0e24]/70 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-purple-500/40"
              />
              <button
                onClick={() => setIsCreateOpen(true)}
                className="flex-1 text-left px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-400 hover:text-white hover:border-[#4B4DFF]/50 transition-all flex items-center justify-between"
              >
                <span>Finished a morning walk or scenic stroll? Post your stride...</span>
                <Sparkles size={14} className="text-[#4B4DFF]" />
              </button>
            </div>

            {/* Posts Stream */}
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-500">
                <RefreshCw size={28} className="animate-spin text-[#4B4DFF] mb-3" />
                <p className="text-sm font-medium">Syncing verified community strides...</p>
              </div>
            ) : displayedPosts.length === 0 ? (
              <div className="bg-[#0b0e24]/60 border border-white/10 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                  <Compass size={28} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">No strides in this view yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
                  {activeTab === 'following'
                    ? 'You are not following anyone yet or your followed walkers haven’t posted recently.'
                    : activeTab === 'saved'
                    ? 'You haven’t bookmarked any strides yet. Click the bookmark icon on any post to save it!'
                    : 'Be the first walker to publish a stride in this category!'}
                </p>
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="gradient-btn px-4 py-2 rounded-xl text-xs font-bold text-white"
                >
                  Create New Stride
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {displayedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onSave={handleSave}
                    onComment={handleComment}
                    onReport={(id, authorName) => setReportingPost({ id, authorName })}
                    onViewProfile={onViewProfile}
                    currentUserId={user.id || 'curr_user'}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar: Walker Community & Suggestions */}
          <div className="lg:col-span-4 space-y-6">
            {/* User Mini Profile Summary */}
            <div className="bg-[#0b0e24] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={user.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#4B4DFF]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white truncate">{user.name}</h3>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                      You
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">@{user.name.toLowerCase().replace(/\s+/g, '_')}</p>
                  <p className="text-[11px] text-cyan-400 font-semibold mt-0.5">{user.memberTier || 'WalkX Elite'}</p>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 text-center">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {posts.filter((p) => p.userId === (user.id || 'curr_user')).length}
                  </span>
                  <span className="text-[10px] text-slate-400">Strides</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    {user.lifetimeSteps ? user.lifetimeSteps.toLocaleString() : '84,200'}
                  </span>
                  <span className="text-[10px] text-slate-400">Total Steps</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-cyan-400 block">
                    {user.totalPoints ? user.totalPoints.toLocaleString() : '1,250'}
                  </span>
                  <span className="text-[10px] text-slate-400">WalkX Pts</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400">Account Visibility:</span>
                <span className="font-semibold text-slate-200 flex items-center gap-1">
                  {isPrivateAccount ? <Lock size={12} className="text-amber-400" /> : <Globe size={12} className="text-emerald-400" />}
                  {isPrivateAccount ? 'Private' : 'Public'}
                </span>
              </div>
            </div>

            {/* Suggested Walkers to Follow */}
            <div className="bg-[#0b0e24] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-[#4B4DFF]" />
                  <h3 className="text-sm font-bold text-white">Suggested Walkers</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Community</span>
              </div>

              <div className="space-y-3.5">
                {suggestedProfiles.map((walker) => (
                  <div
                    key={walker.id}
                    className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-all"
                  >
                    <div
                      onClick={() => onViewProfile(walker.id)}
                      className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                    >
                      <div className="relative">
                        <img
                          src={walker.avatar}
                          alt={walker.name}
                          className="w-10 h-10 rounded-xl object-cover border border-white/10"
                        />
                        {walker.isPrivate && (
                          <div
                            title="Private Account"
                            className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-900 border border-amber-500/40 rounded-full flex items-center justify-center text-amber-400"
                          >
                            <Lock size={9} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-bold text-white truncate hover:text-[#4B4DFF]">
                            {walker.name}
                          </p>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">@{walker.username}</p>
                        <p className="text-[10px] text-indigo-400 truncate">{walker.badgeTitle}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleFollowToggle(walker.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                        walker.followStatus === 'following'
                          ? 'bg-white/[0.08] text-slate-300 hover:bg-rose-500/20 hover:text-rose-400'
                          : walker.followStatus === 'requested'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-[#4B4DFF] text-white hover:bg-[#6D3DFF] shadow-sm'
                      }`}
                    >
                      {walker.followStatus === 'following'
                        ? 'Following'
                        : walker.followStatus === 'requested'
                        ? 'Requested'
                        : '+ Follow'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Standards & Verified Telemetry Box */}
            <div className="bg-[#0b0e24]/70 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
                <ShieldCheck size={16} />
                <span>Fair Play & Anti-Spoof Policy</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Step counts and activity distances displayed in WalkX feed cards are verified against device pedometers and GPS sensors. Fraudulent step injection is automatically flagged by our auditing engine.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Post Creation Modal */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={async (postData) => {
          try {
            const newPost = await socialService.createPost({
              caption: postData.caption,
              photos: postData.photos,
              activityType: postData.activityType,
              metrics: postData.metrics,
              placeTag: postData.placeTag,
              visibility: postData.visibility,
              user: {
                id: user.id || 'curr_user',
                name: user.name || 'Priya Sharma',
                avatarUrl: user.avatarUrl,
                memberTier: user.memberTier
              }
            });
            setPosts((prev) => [newPost, ...prev]);
            showToast('Your stride has been shared with WalkX!');
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 }
            });
          } catch {
            showToast('Unable to publish stride post.');
          }
        }}
        user={user}
      />

      {/* Report Post Modal */}
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
