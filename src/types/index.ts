// this file is for type safety
export interface LoginResponse {
  token: string;
}  


export interface LeaderboardUser {
  id: number;
  name: string;
  points: number;
}

// src/types/index.ts

export interface MatchOption {
  id: number;
  name: string;
}

export interface Match {
  id: number;
  teamA: string;
  teamB: string;
  options: MatchOption[];
}