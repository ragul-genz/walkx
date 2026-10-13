import {
  WalkingPlace,
  LeaderboardEntry,
  CommunityChallenge,
  AgeBracket,
  LeaderboardTimeframe,
  LeaderboardCategory,
  PlaceDifficulty,
  UserVisitedPlaceInput
} from '../types';
import { initialPlaces, initialLeaderboard, initialChallenges } from '../data/communityData';

class CommunityService {
  private places: WalkingPlace[];
  private leaderboard: LeaderboardEntry[];
  private challenges: CommunityChallenge[];

  constructor() {
    this.places = this.loadPlaces();
    this.leaderboard = this.loadLeaderboard();
    this.challenges = this.loadChallenges();
  }

  private loadPlaces(): WalkingPlace[] {
    try {
      const stored = localStorage.getItem('walkx_community_places');
      return stored ? JSON.parse(stored) : initialPlaces;
    } catch {
      return initialPlaces;
    }
  }

  private loadLeaderboard(): LeaderboardEntry[] {
    try {
      const stored = localStorage.getItem('walkx_community_leaderboard');
      return stored ? JSON.parse(stored) : initialLeaderboard;
    } catch {
      return initialLeaderboard;
    }
  }

  private loadChallenges(): CommunityChallenge[] {
    try {
      const stored = localStorage.getItem('walkx_community_challenges');
      return stored ? JSON.parse(stored) : initialChallenges;
    } catch {
      return initialChallenges;
    }
  }

  private persist() {
    try {
      localStorage.setItem('walkx_community_places', JSON.stringify(this.places));
      localStorage.setItem('walkx_community_leaderboard', JSON.stringify(this.leaderboard));
      localStorage.setItem('walkx_community_challenges', JSON.stringify(this.challenges));
    } catch {
      // Ignore
    }
  }

  // ==========================================
  // PLACES DISCOVERY METHODS
  // ==========================================

  getPlaces(params?: {
    category?: string;
    city?: string;
    difficulty?: PlaceDifficulty | 'All';
    search?: string;
    suitability?: string;
    visitedOnly?: boolean;
  }): WalkingPlace[] {
    let result = [...this.places];

    if (params?.visitedOnly) {
      result = result.filter((p) => p.isCheckedIn);
    }

    if (params?.search && params.search.trim()) {
      const query = params.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    if (params?.category && params.category !== 'All') {
      result = result.filter((p) => p.category === params.category);
    }

    if (params?.city && params.city !== 'All') {
      const targetCity = params.city.toLowerCase();
      result = result.filter((p) => p.city.toLowerCase() === targetCity);
    }

    if (params?.difficulty && params.difficulty !== 'All') {
      result = result.filter((p) => p.difficulty === params.difficulty);
    }

    if (params?.suitability && params.suitability !== 'All') {
      result = result.filter((p) => p.suitability.includes(params.suitability as any));
    }

    return result;
  }

  getPlaceById(id: string): WalkingPlace | undefined {
    return this.places.find((p) => p.id === id);
  }

  getVisitedPlaces(): WalkingPlace[] {
    return this.places.filter((p) => p.isCheckedIn);
  }

  getCities(): string[] {
    const citySet = new Set<string>();
    this.places.forEach((p) => {
      if (p.city) citySet.add(p.city);
    });
    return Array.from(citySet).sort();
  }

  /**
   * Add a place the user has visited
   */
  addVisitedPlace(input: UserVisitedPlaceInput, authorName: string = 'You'): WalkingPlace {
    const estimatedSteps = Math.round(input.distanceKm * 1350);
    const durationMinutes = Math.round(input.distanceKm * 13);
    const newPlace: WalkingPlace = {
      id: `usr_plc_${Date.now()}`,
      title: input.title.trim(),
      category: input.category,
      location: input.location.trim() || input.city,
      city: input.city.trim(),
      distanceKm: input.distanceKm,
      estimatedSteps,
      durationMinutes,
      difficulty: input.difficulty,
      suitability: input.suitability.length > 0 ? input.suitability : ['All Ages'],
      rating: 5.0,
      reviewsCount: 1,
      checkInsCount: 1,
      hasShade: input.hasShade ?? true,
      hasBenches: input.hasBenches ?? true,
      hasRestrooms: false,
      hasWaterFountains: input.hasWaterFountains ?? false,
      isWheelchairAccessible: input.isWheelchairAccessible ?? false,
      imageUrl:
        input.imageUrl ||
        'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        input.imageUrl ||
        'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80'
      ],
      description: input.description.trim() || `Scenic walking trail in ${input.city} added by ${authorName}.`,
      tips: input.tips?.trim() || 'Recommended by a local community walker.',
      popularTime: 'Morning Stride Hours',
      isCheckedIn: true,
      isUserAdded: true,
      dateVisited: input.dateVisited || new Date().toISOString().split('T')[0],
      authorName,
      coordinates: input.coordinates,
      waypoints: [
        { name: `${input.title} Entrance`, distanceKm: 0.0 },
        { name: 'Midway Vista Point', distanceKm: Number((input.distanceKm * 0.5).toFixed(1)) },
        { name: 'Trail Loop Finish', distanceKm: input.distanceKm }
      ]
    };

    // Prepend to places
    this.places = [newPlace, ...this.places];
    this.persist();
    return newPlace;
  }

  toggleCheckIn(placeId: string): boolean {
    const place = this.places.find((p) => p.id === placeId);
    if (!place) return false;

    place.isCheckedIn = !place.isCheckedIn;
    place.checkInsCount = place.isCheckedIn ? place.checkInsCount + 1 : Math.max(0, place.checkInsCount - 1);
    this.persist();
    return place.isCheckedIn;
  }

  /**
   * Unified search across places, challenges, and walkers
   */
  searchAll(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) {
      return {
        places: this.places.slice(0, 4),
        challenges: this.challenges.slice(0, 3),
        walkers: this.leaderboard.slice(0, 3)
      };
    }

    const matchedPlaces = this.places.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );

    const matchedChallenges = this.challenges.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.audience.toLowerCase().includes(q)
    );

    const matchedWalkers = this.leaderboard.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.username.toLowerCase().includes(q) ||
        w.city.toLowerCase().includes(q)
    );

    return {
      places: matchedPlaces,
      challenges: matchedChallenges,
      walkers: matchedWalkers
    };
  }

  // ==========================================
  // LEADERBOARDS METHODS
  // ==========================================

  getLeaderboard(params?: {
    ageBracket?: AgeBracket;
    timeframe?: LeaderboardTimeframe;
    category?: LeaderboardCategory;
  }): LeaderboardEntry[] {
    let list = [...this.leaderboard];

    if (params?.ageBracket && params.ageBracket !== 'all') {
      list = list.filter((item) => item.ageBracket === params.ageBracket);
    }

    // Sort by metric
    const category = params?.category || 'steps';
    if (category === 'steps') {
      list.sort((a, b) => b.steps - a.steps);
    } else if (category === 'streak') {
      list.sort((a, b) => b.streakDays - a.streakDays);
    } else if (category === 'charity') {
      list.sort((a, b) => b.charityPointsDonated - a.charityPointsDonated);
    } else if (category === 'places_explored') {
      list.sort((a, b) => b.placesExplored - a.placesExplored);
    }

    // Re-rank for current view
    return list.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));
  }

  // ==========================================
  // COMMUNITY CHALLENGES METHODS
  // ==========================================

  getChallenges(filter?: 'all' | 'joined' | 'explore'): CommunityChallenge[] {
    if (filter === 'joined') {
      return this.challenges.filter((c) => c.joined);
    }
    if (filter === 'explore') {
      return this.challenges.filter((c) => !c.joined);
    }
    return [...this.challenges];
  }

  toggleJoinChallenge(challengeId: string): boolean {
    const challenge = this.challenges.find((c) => c.id === challengeId);
    if (!challenge) return false;

    challenge.joined = !challenge.joined;
    challenge.participantsCount = challenge.joined
      ? challenge.participantsCount + 1
      : Math.max(0, challenge.participantsCount - 1);
    this.persist();
    return challenge.joined;
  }
}

export const communityService = new CommunityService();
