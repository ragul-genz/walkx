import {
  WalkingPlace,
  LeaderboardEntry,
  CommunityChallenge,
  AgeBracket,
  LeaderboardTimeframe,
  LeaderboardCategory,
  PlaceDifficulty
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
  }): WalkingPlace[] {
    let result = [...this.places];

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

  toggleCheckIn(placeId: string): boolean {
    const place = this.places.find((p) => p.id === placeId);
    if (!place) return false;

    place.isCheckedIn = !place.isCheckedIn;
    place.checkInsCount = place.isCheckedIn ? place.checkInsCount + 1 : Math.max(0, place.checkInsCount - 1);
    this.persist();
    return place.isCheckedIn;
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
