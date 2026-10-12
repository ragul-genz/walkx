import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MapPin,
  Activity,
  Globe,
  Users,
  Lock,
  MoreHorizontal,
  Send,
  Flag,
  Check,
  Sparkles
} from 'lucide-react';
import { SocialPost, SocialComment } from '../../types';

interface PostCardProps {
  post: SocialPost;
  onLike: (postId: string) => Promise<void>;
  onSave: (postId: string) => Promise<void>;
  onComment: (postId: string, text: string) => Promise<SocialComment | void>;
  onReport: (postId: string, authorName: string) => void;
  onViewProfile: (userId: string) => void;
  currentUserId?: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onSave,
  onComment,
  onReport,
  onViewProfile
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState<SocialComment[]>(post.comments || []);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const handleLikeClick = async () => {
    // Optimistic UI toggle
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));
    if (nextState) {
      setLikeAnim(true);
      setTimeout(() => setLikeAnim(false), 800);
    }
    await onLike(post.id);
  };

  const handleSaveClick = async () => {
    setIsSaved(!isSaved);
    await onSave(post.id);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const added = await onComment(post.id, commentText.trim());
      if (added) {
        setCommentsList((prev) => [...prev, added]);
      } else {
        setCommentsList((prev) => [
          ...prev,
          {
            id: `cmt_${Date.now()}`,
            postId: post.id,
            userId: 'curr_user',
            userName: 'You',
            userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            text: commentText.trim(),
            createdAt: 'Just now'
          }
        ]);
      }
      setCommentText('');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getVisibilityBadge = () => {
    switch (post.visibility) {
      case 'followers_only':
        return (
          <span className="flex items-center gap-1 text-[10px] text-purple-300 font-semibold bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
            <Users size={10} />
            <span>Followers Only</span>
          </span>
        );
      case 'private':
        return (
          <span className="flex items-center gap-1 text-[10px] text-slate-300 font-semibold bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
            <Lock size={10} />
            <span>Private Stride</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] text-cyan-300 font-semibold bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/30">
            <Globe size={10} />
            <span>Public</span>
          </span>
        );
    }
  };

  return (
    <article className="rounded-3xl bg-[#0b0e24]/90 border border-white/[0.08] hover:border-purple-500/30 transition-all duration-300 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Post Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/[0.05]">
        <div
          onClick={() => onViewProfile(post.userId)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <img
              src={post.userAvatar}
              alt={post.userName}
              className="w-11 h-11 rounded-2xl object-cover border border-white/10 group-hover:scale-105 transition-transform"
            />
            {post.isPrivateAccount && (
              <span
                title="Private Account"
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border border-white/20 text-slate-300 flex items-center justify-center text-[9px]"
              >
                🔒
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white group-hover:text-purple-300 transition-colors">
                {post.userName}
              </h3>
              {post.userBadge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#4B4DFF]/20 to-[#6D3DFF]/20 text-cyan-300 border border-purple-500/30 flex items-center gap-1">
                  <Sparkles size={9} className="text-cyan-400" />
                  {post.userBadge}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-slate-400 font-medium">{post.createdAt}</span>
              <span className="text-slate-600">·</span>
              {getVisibilityBadge()}
            </div>
          </div>
        </div>

        {/* 3-dots Menu Button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors"
          >
            <MoreHorizontal size={18} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-10 w-44 rounded-2xl bg-[#0e1330] border border-white/10 shadow-2xl p-1.5 z-20 space-y-1 animate-in fade-in">
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleShare();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-2"
              >
                <Share2 size={13} />
                <span>{copiedLink ? 'Link Copied!' : 'Share Stride'}</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onReport(post.id, post.userName);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/20 flex items-center gap-2"
              >
                <Flag size={13} />
                <span>Report Content</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Activity Tag & Place Strip */}
      <div className="px-4 sm:px-5 pt-3.5 flex flex-wrap items-center gap-2">
        <span className="px-3 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-[#4B4DFF] to-[#6D3DFF] text-white shadow-md shadow-purple-600/20 flex items-center gap-1.5">
          <Activity size={12} />
          <span>{post.activityType}</span>
        </span>
        {post.placeTag && (
          <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white/[0.04] text-slate-300 border border-white/10 flex items-center gap-1.5 hover:text-white">
            <MapPin size={12} className="text-rose-400" />
            <span>
              {post.placeTag.name}
              {post.placeTag.city ? `, ${post.placeTag.city}` : ''}
            </span>
          </span>
        )}
      </div>

      {/* Caption Text */}
      <div className="px-4 sm:px-5 py-3">
        <p className="text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-line">
          {post.caption}
        </p>
      </div>

      {/* Verified Telemetry Strip (if attached) */}
      {post.metrics && (
        <div className="mx-4 sm:mx-5 mb-3 p-3 rounded-2xl bg-gradient-to-r from-[#111738] via-[#0d122d] to-[#12183a] border border-purple-500/25 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">👟</span>
            <div>
              <span className="font-extrabold text-white">
                {post.metrics.steps?.toLocaleString() || 0}
              </span>
              <span className="text-slate-400 text-[11px] ml-1">steps</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-300">
            {post.metrics.distanceKm && (
              <span>
                <strong className="text-white">{post.metrics.distanceKm}</strong> km
              </span>
            )}
            {post.metrics.durationMinutes && (
              <span>
                <strong className="text-white">{post.metrics.durationMinutes}</strong> mins
              </span>
            )}
          </div>
          {post.metrics.pointsEarned && (
            <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-extrabold text-[11px] border border-amber-500/30">
              +{post.metrics.pointsEarned} pts
            </span>
          )}
        </div>
      )}

      {/* Post Photo Gallery */}
      {post.photos && post.photos.length > 0 && (
        <div className="relative bg-black/40 overflow-hidden">
          <div className="aspect-[4/3] sm:aspect-[16/10] w-full relative">
            <img
              src={post.photos[activePhotoIdx] || post.photos[0]}
              alt="Stride Activity"
              className="w-full h-full object-cover transition-all duration-300"
            />
            {/* Heart Animation Pop */}
            {likeAnim && (
              <div className="absolute inset-0 flex items-center justify-center animate-ping pointer-events-none">
                <Heart size={80} className="fill-rose-500 text-rose-500 opacity-90" />
              </div>
            )}
          </div>

          {/* Photo Dots pagination if multiple */}
          {post.photos.length > 1 && (
            <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5">
              {post.photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhotoIdx(i)}
                  className={`h-2 rounded-full transition-all ${
                    activePhotoIdx === i ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Bar */}
      <div className="px-4 sm:px-5 py-3 border-t border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Like Button */}
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-1.5 text-xs font-bold transition-all active:scale-90 cursor-pointer ${
              isLiked ? 'text-rose-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart
              size={18}
              className={`transition-transform duration-200 ${
                isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''
              }`}
            />
            <span>{likesCount}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <MessageCircle size={18} />
            <span>{commentsList.length}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {copiedLink ? <Check size={18} className="text-emerald-400" /> : <Share2 size={18} />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
          </button>
        </div>

        {/* Save / Bookmark Button */}
        <button
          onClick={handleSaveClick}
          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
            isSaved
              ? 'text-[#4B4DFF] bg-[#4B4DFF]/15'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
          }`}
          title={isSaved ? 'Remove from Saved' : 'Save Post'}
        >
          <Bookmark size={18} className={isSaved ? 'fill-[#4B4DFF]' : ''} />
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#070918]/90 space-y-3.5 animate-in fade-in duration-200">
          <h4 className="text-xs font-extrabold text-slate-300">
            Comments ({commentsList.length})
          </h4>

          {/* Existing comments list */}
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {commentsList.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No comments yet. Be the first to cheer!</p>
            ) : (
              commentsList.map((c) => (
                <div key={c.id} className="flex items-start gap-2.5 text-xs">
                  <img
                    src={c.userAvatar}
                    alt={c.userName}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 bg-white/[0.03] p-2.5 rounded-2xl border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-white text-[11px]">{c.userName}</span>
                      <span className="text-[10px] text-slate-500">{c.createdAt}</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Input Form */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Cheer this walker on..."
              maxLength={200}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#4B4DFF]"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || isSubmittingComment}
              className="p-2.5 rounded-2xl bg-[#4B4DFF] hover:bg-[#6D3DFF] text-white active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
