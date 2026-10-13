import React, { useState, useEffect } from 'react';
import {
  Compass,
  Search,
  MapPin,
  Users,
  Trophy,
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BookmarkCheck,
  PlusCircle,
  Footprints,
  Star,
  Activity,
  Heart,
  MessageCircle,
  Shield,
  Layers,
  Filter,
  X
} from 'lucide-react';
import {
  PageId,
  WalkingPlace,
  SocialPost,
  SocialUserProfile,
  CommunityChallenge,
  UserProfile,
  UserVisitedPlaceInput,
  ActivityType,
  PlaceDifficulty,
  PlaceSuitability
} from '../types';
import { communityService } from '../services/communityService';
import { socialService } from '../services/socialService';
import { CityLocationBar } from '../components/places/CityLocationBar';
import { AddVisitedPlaceModal } from '../components/places/AddVisitedPlaceModal';
import { TrailMapView } from '../components/places/TrailMapView';
import { PostCard } from '../components/social/PostCard';

interface ExplorePageProps {
  user: UserProfile;
  onNavigate: (page: PageId) => void;
  onViewProfile: (userId: string) => void;
  showToast: (msg: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  user,
  onNavigate,
  onViewProfile,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'places' | 'posts' | 'striders' | 'challenges'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | 'All'>('All');
  const [inspectingPlace, setInspectingPlace] = useState<WalkingPlace | null>(null);
  const [isAddVisitedModalOpen, setIsAddVisitedModalOpen] = useState(false);

  // Data states
  const [publicPosts, setPublicPosts] = useState<SocialPost[]>([]);
  const [communityWalkers, setCommunityWalkers] = useState<SocialUserProfile[]>([]);
  const [challenges, setChallenges] = useState<CommunityChallenge[]>([]);

  const availableCities = communityService.getCities();

  // Load public posts, users, challenges
  useEffect(() => {
    const loadExploreData = async () => {
      try {
        const feedPosts = await socialService.getFeed({
          tab: 'for_you',
          currentUserId: user.id || 'curr_user'
        });
        // Filter strictly public posts for community discovery
        const publicOnly = feedPosts.filter((p) => p.visibility === 'public');
        setPublicPosts(publicOnly);

        const profiles = await socialService.getAllProfiles();
        setCommunityWalkers(profiles);

        setChallenges(communityService.getChallenges('all'));
      } catch (err) {
        console.warn('Explore data load error:', err);
      }
    };

    loadExploreData();
  }, [user.id]);

  // Filtered places
  const places = communityService.getPlaces({
    category: selectedCategory,
    city: selectedCity,
    search: searchQuery
  });

  const handleToggleCheckIn = (place: WalkingPlace) => {
    const checked = communityService.toggleCheckIn(place.id);
    showToast(
      checked
        ? `Checked into ${place.title}! Recorded in your Places Explored.`
        : `Removed check-in from ${place.title}.`
    );
    if (inspectingPlace?.id === place.id) {
      setInspectingPlace({
        ...inspectingPlace,
        isCheckedIn: checked,
        checkInsCount: checked ? inspectingPlace.checkInsCount + 1 : Math.max(0, inspectingPlace.checkInsCount - 1)
      });
    }
  };

  const handleSaveVisitedPlace = (input: UserVisitedPlaceInput) => {
    const newPlace = communityService.addVisitedPlace(input);
    showToast(`Added ${newPlace.title} to your Visited Places log! 🎉`);
    setActiveTab('places');
  };

  const handleToggleFollow = async (profileId: string) => {
    const res = await socialService.toggleFollow(profileId);
    setCommunityWalkers((prev) =>
      prev.map((pr) => (pr.id === profileId ? { ...pr, isFollowing: res.isFollowing } : pr))
    );
    showToast(res.isFollowing ? 'Following walker! Their strides will appear in your feed.' : 'Unfollowed walker.');
  };

  const handleToggleJoinChallenge = (challengeId: string) => {
    const joined = communityService.toggleJoinChallenge(challengeId);
    setChallenges(communityService.getChallenges('all'));
    showToast(joined ? 'Joined Community Challenge! Stride to unlock badge.' : 'Left Challenge.');
  };

  // Filtered lists for specific tabs
  const filteredPosts = publicPosts.filter((p) => {
    const matchesSearch = !searchQuery.trim() ||
      p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.placeTag?.name && p.placeTag.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesActivity = selectedActivity === 'All' || p.activityType === selectedActivity;
    return matchesSearch && matchesActivity;
  });

  const filteredWalkers = communityWalkers.filter((w) => {
    const matchesSearch = !searchQuery.trim() ||
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'All' || w.city.toLowerCase().includes(selectedCity.toLowerCase());
    return matchesSearch && matchesCity;
  });

  const filteredChallenges = challenges.filter((c) => {
    return !searchQuery.trim() ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.audience.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#111244] via-[#0d102e] to-[#1e103f] border border-white/10 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#4B4DFF]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4B4DFF]/20 border border-[#4B4DFF]/30 text-indigo-300 text-xs font-semibold mb-3">
                <Compass size={14} className="text-[#4B4DFF] animate-spin-slow" />
                <span>Explore & Community Discovery</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
                Discover Public Strides, Trails, Walkers & Quests
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Connect with the broader WalkX community: explore scenic trail loops, discover inspiring public stride stories, follow top walkers in your city, and join active wellness challenges.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch md:items-end gap-3 shrink-0">
              <button
                onClick={() => setIsAddVisitedModalOpen(true)}
                className="gradient-btn px-5 py-3 rounded-2xl text-xs font-extrabold text-white flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30 active:scale-95 transition-all cursor-pointer"
              >
                <PlusCircle size={16} />
                <span>Add Place I Visited</span>
              </button>
            </div>
          </div>
        </div>

        {/* City Location Bar with Graceful GPS Fallback */}
        <CityLocationBar
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          availableCities={availableCities}
        />

        {/* Unified Discovery Search & Navigation Tabs */}
        <div className="bg-[#0b0e24] border border-white/10 rounded-2xl p-4 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Global Search Bar */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search across places, public strides, walkers, and challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4B4DFF]"
              />
            </div>
          </div>

          {/* Tab Navigation: Overview, Places, Public Strides, Striders, Challenges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-white/05 pt-3">
            {[
              { id: 'overview', label: 'Explore Overview', icon: Sparkles, count: undefined },
              { id: 'places', label: 'Places & Trails', icon: Compass, count: places.length },
              { id: 'posts', label: 'Public Strides', icon: Footprints, count: publicPosts.length },
              { id: 'striders', label: 'Walkers & Community', icon: Users, count: communityWalkers.length },
              { id: 'challenges', label: 'Quests & Challenges', icon: Zap, count: challenges.length }
            ].map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    active
                      ? 'bg-[#4B4DFF] text-white shadow-[0_0_15px_rgba(75,77,255,0.4)]'
                      : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/05'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-slate-300">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: EXPLORE OVERVIEW (Unified Highlights Across All 4 Pillars) */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-fade-in">
            {/* Section 1: Featured Scenic Places */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-[#4B4DFF] flex items-center justify-center font-bold">
                    <Compass size={16} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white font-['Outfit']">Scenic Walking Routes</h2>
                    <p className="text-xs text-slate-400">Authentic trails and canopied loops across Indian cities</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('places')}
                  className="text-xs font-semibold text-indigo-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>View All {places.length} Places</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {places.slice(0, 3).map((place) => (
                  <div
                    key={place.id}
                    className="group bg-[#0b0e24] border border-white/10 rounded-2xl overflow-hidden hover:border-[#4B4DFF]/50 transition-all flex flex-col"
                  >
                    <div
                      className="relative h-44 overflow-hidden bg-slate-900 cursor-pointer"
                      onClick={() => setInspectingPlace(place)}
                    >
                      <img
                        src={place.imageUrl}
                        alt={place.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e24] via-transparent to-black/30" />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-black/60 text-white border border-white/20">
                        {place.category}
                      </div>
                      <div className="absolute bottom-2 left-2.5 text-xs text-slate-300 flex items-center gap-1">
                        <MapPin size={11} className="text-rose-400" />
                        <span className="truncate">{place.city}</span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3
                          onClick={() => setInspectingPlace(place)}
                          className="text-sm font-bold text-white group-hover:text-[#4B4DFF] transition-colors cursor-pointer"
                        >
                          {place.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {place.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-semibold">{place.distanceKm} km • ~{place.estimatedSteps.toLocaleString()} steps</span>
                        <button
                          onClick={() => handleToggleCheckIn(place)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                            place.isCheckedIn
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-white/[0.06] text-slate-300 hover:text-white'
                          }`}
                        >
                          {place.isCheckedIn ? 'Walked ✓' : 'I Walked Here'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Trending Public Stride Stories */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                    <Footprints size={16} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white font-['Outfit']">Public Community Strides</h2>
                    <p className="text-xs text-slate-400">Recent morning strides & scenic photos shared by walkers</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('posts')}
                  className="text-xs font-semibold text-indigo-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>View All Public Posts</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {publicPosts.slice(0, 2).map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={user.id || 'curr_user'}
                    onLike={async () => {
                      await socialService.toggleLike(post.id);
                    }}
                    onComment={async (postId, text) => {
                      return await socialService.addComment(postId, text, {
                        id: user.id || 'curr_user',
                        name: user.name,
                        avatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                      });
                    }}
                    onSave={async () => {
                      await socialService.toggleSave(post.id);
                    }}
                    onReport={() => {
                      showToast('Post reported for moderation review.');
                    }}
                    onViewProfile={onViewProfile}
                  />
                ))}
              </div>
            </div>

            {/* Section 3: Community Walkers to Follow */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                    <Users size={16} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white font-['Outfit']">Striders to Follow</h2>
                    <p className="text-xs text-slate-400">Active walkers and milestone achievers across your region</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('striders')}
                  className="text-xs font-semibold text-indigo-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Explore Walkers Directory</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {communityWalkers.slice(0, 4).map((walker) => (
                  <div
                    key={walker.id}
                    className="p-4 rounded-2xl bg-[#0b0e24] border border-white/10 flex flex-col items-center text-center justify-between hover:border-purple-500/30 transition-all"
                  >
                    <div
                      className="cursor-pointer group flex flex-col items-center"
                      onClick={() => onViewProfile(walker.id)}
                    >
                      <div className="w-14 h-14 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-[#4B4DFF] to-teal-400 mb-2.5">
                        <img
                          src={walker.avatar}
                          alt={walker.name}
                          className="w-full h-full object-cover rounded-[14px]"
                        />
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#4B4DFF] transition-colors">
                        {walker.name}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">@{walker.username}</span>
                      <span className="text-[10px] text-indigo-300 font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 mt-1.5">
                        {walker.badgeTitle}
                      </span>
                    </div>

                    <div className="w-full pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">{walker.city.split(',')[0]}</span>
                      <button
                        onClick={() => handleToggleFollow(walker.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          walker.isFollowing
                            ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                            : 'gradient-btn text-white'
                        }`}
                      >
                        {walker.isFollowing ? 'Following' : '+ Follow'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Active Community Challenges */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Zap size={16} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white font-['Outfit']">Active Community Challenges</h2>
                    <p className="text-xs text-slate-400">Join collaborative quests and earn bonus WalkX Points</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('challenges')}
                  className="text-xs font-semibold text-indigo-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>View All Challenges</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges.slice(0, 2).map((ch) => (
                  <div
                    key={ch.id}
                    className="p-5 rounded-2xl bg-[#0b0e24] border border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                          {ch.audience}
                        </span>
                        <span className="text-amber-400 font-bold">+{ch.rewardPoints} pts</span>
                      </div>
                      <h3 className="text-base font-bold text-white font-['Outfit']">{ch.title}</h3>
                      <p className="text-xs text-slate-300 mt-1">{ch.description}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{ch.participantsCount.toLocaleString()} striders joined</span>
                      <button
                        onClick={() => handleToggleJoinChallenge(ch.id)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          ch.joined
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'gradient-btn text-white'
                        }`}
                      >
                        {ch.joined ? 'Joined ✓' : 'Join Quest'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PLACES & TRAILS */}
        {/* ========================================================================= */}
        {activeTab === 'places' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="group bg-[#0b0e24] border border-white/10 rounded-2xl overflow-hidden hover:border-[#4B4DFF]/50 transition-all flex flex-col"
                >
                  <div
                    className="relative h-48 overflow-hidden bg-slate-900 cursor-pointer"
                    onClick={() => setInspectingPlace(place)}
                  >
                    <img
                      src={place.imageUrl}
                      alt={place.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e24] via-transparent to-black/30" />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-black/60 text-white border border-white/20">
                      {place.category}
                    </div>
                    <div className="absolute bottom-2 left-2.5 text-xs text-slate-300 flex items-center gap-1">
                      <MapPin size={11} className="text-rose-400" />
                      <span className="truncate">{place.location}, {place.city}</span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => setInspectingPlace(place)}
                        className="text-base font-bold text-white group-hover:text-[#4B4DFF] transition-colors cursor-pointer"
                      >
                        {place.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {place.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-300 mt-3 font-semibold">
                        <span>{place.distanceKm} km</span>
                        <span>•</span>
                        <span>~{place.estimatedSteps.toLocaleString()} steps</span>
                        <span>•</span>
                        <span className="text-amber-400">{place.rating} ★</span>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleToggleCheckIn(place)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                          place.isCheckedIn
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-white/[0.06] text-slate-200 hover:text-white'
                        }`}
                      >
                        {place.isCheckedIn ? 'Walked Here ✓' : 'I Walked Here'}
                      </button>
                      <button
                        onClick={() => setInspectingPlace(place)}
                        className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white"
                        title="View route map"
                      >
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PUBLIC STRIDES */}
        {/* ========================================================================= */}
        {activeTab === 'posts' && (
          <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
            {filteredPosts.length === 0 ? (
              <div className="py-16 text-center bg-[#0b0e24] border border-white/10 rounded-3xl p-6">
                <Footprints size={40} className="mx-auto text-indigo-400 mb-3 opacity-60" />
                <h3 className="text-lg font-bold text-white mb-1">No public strides matching search</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  Try another keyword or be the first to publish a public stride!
                </p>
                <button
                  onClick={() => onNavigate('feed')}
                  className="gradient-btn px-4 py-2 rounded-xl text-xs font-bold text-white"
                >
                  Go to Feed & Post Stride
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={user.id || 'curr_user'}
                  onLike={async () => {
                    await socialService.toggleLike(post.id);
                  }}
                  onComment={async (postId, text) => {
                    return await socialService.addComment(postId, text, {
                      id: user.id || 'curr_user',
                      name: user.name,
                      avatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                    });
                  }}
                  onSave={async () => {
                    await socialService.toggleSave(post.id);
                  }}
                  onReport={() => {
                    showToast('Post reported for moderation review.');
                  }}
                  onViewProfile={onViewProfile}
                />
              ))
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: STRIDERS / COMMUNITY USERS */}
        {/* ========================================================================= */}
        {activeTab === 'striders' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredWalkers.map((walker) => (
                <div
                  key={walker.id}
                  className="p-5 rounded-2xl bg-[#0b0e24] border border-white/10 flex flex-col items-center text-center justify-between hover:border-purple-500/30 transition-all"
                >
                  <div
                    className="cursor-pointer group flex flex-col items-center"
                    onClick={() => onViewProfile(walker.id)}
                  >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-[#4B4DFF] to-teal-400 mb-3 shadow-md">
                      <img
                        src={walker.avatar}
                        alt={walker.name}
                        className="w-full h-full object-cover rounded-[14px]"
                      />
                    </div>
                    <h4 className="text-base font-bold text-white group-hover:text-[#4B4DFF] transition-colors">
                      {walker.name}
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">@{walker.username}</span>
                    <span className="text-[11px] text-indigo-300 font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 mt-2">
                      {walker.badgeTitle}
                    </span>
                    <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 px-1">
                      {walker.bio}
                    </p>
                  </div>

                  <div className="w-full pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">{walker.city}</span>
                    <button
                      onClick={() => handleToggleFollow(walker.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        walker.isFollowing
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                          : 'gradient-btn text-white'
                      }`}
                    >
                      {walker.isFollowing ? 'Following' : '+ Follow'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: QUESTS & CHALLENGES */}
        {/* ========================================================================= */}
        {activeTab === 'challenges' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredChallenges.map((ch) => (
                <div
                  key={ch.id}
                  className="p-5 rounded-2xl bg-[#0b0e24] border border-white/10 flex flex-col justify-between hover:border-purple-500/30 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                        {ch.audience}
                      </span>
                      <span className="text-amber-400 font-bold">+{ch.rewardPoints} pts</span>
                    </div>
                    <h3 className="text-lg font-bold text-white font-['Outfit']">{ch.title}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{ch.description}</p>
                    <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/05 text-xs text-slate-300 space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span>Goal: {ch.goalSteps.toLocaleString()} steps</span>
                        <span>{ch.daysRemaining} days left</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{ch.participantsCount.toLocaleString()} participants</span>
                    <button
                      onClick={() => handleToggleJoinChallenge(ch.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        ch.joined
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'gradient-btn text-white'
                      }`}
                    >
                      {ch.joined ? 'Joined ✓' : 'Join Quest'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Place Detail Inspector Modal with Reliable Map View */}
      {inspectingPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0b0e24] border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
            <div className="relative h-56 sm:h-64 w-full bg-slate-900 shrink-0">
              <img
                src={inspectingPlace.imageUrl}
                alt={inspectingPlace.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e24] via-black/30 to-black/60" />
              <button
                onClick={() => setInspectingPlace(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-slate-300 hover:text-white backdrop-blur-md cursor-pointer"
              >
                <X size={18} />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                  {inspectingPlace.category} • {inspectingPlace.difficulty}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
                  {inspectingPlace.title}
                </h2>
                <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                  <MapPin size={12} className="text-rose-400" />
                  <span>{inspectingPlace.location}, {inspectingPlace.city}</span>
                </p>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-4 gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/05 text-center">
                <div>
                  <span className="text-sm font-bold text-white block">{inspectingPlace.distanceKm} km</span>
                  <span className="text-[10px] text-slate-400">Route Length</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-cyan-400 block">{inspectingPlace.estimatedSteps.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400">Step Target</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-indigo-300 block">{inspectingPlace.durationMinutes} min</span>
                  <span className="text-[10px] text-slate-400">Duration</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-amber-400 block">{inspectingPlace.rating} ★</span>
                  <span className="text-[10px] text-slate-400">({inspectingPlace.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Reliable Trail Map & Waypoint Profile Component */}
              <TrailMapView place={inspectingPlace} />

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About This Trail</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {inspectingPlace.description}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20">
                <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-bold mb-1">
                  <Sparkles size={13} />
                  <span>Walker Tips & Best Hours</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {inspectingPlace.tips}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-900/60 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => handleToggleCheckIn(inspectingPlace)}
                className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  inspectingPlace.isCheckedIn
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-white/[0.08] text-white hover:bg-white/[0.15] border border-white/10'
                }`}
              >
                <CheckCircle2 size={14} />
                <span>{inspectingPlace.isCheckedIn ? 'Checked In ✓' : 'I Walked Here'}</span>
              </button>

              <button
                onClick={() => {
                  setInspectingPlace(null);
                  onNavigate('feed');
                  showToast(`Post a stride from ${inspectingPlace.title}!`);
                }}
                className="flex-1 py-2.5 rounded-2xl text-xs font-bold gradient-btn text-white flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Footprints size={14} />
                <span>Share Stride From Here</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Visited Place Modal */}
      <AddVisitedPlaceModal
        isOpen={isAddVisitedModalOpen}
        onClose={() => setIsAddVisitedModalOpen(false)}
        onSubmit={handleSaveVisitedPlace}
        defaultCity={selectedCity}
      />
    </div>
  );
};
