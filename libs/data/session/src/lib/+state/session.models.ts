/**
 * Interface for the 'Session' data
 */

export interface SessionUser {
  id: string;
  name: string;
  imageUrl?: string;
  hand: string[];
  selectedCards: string[];
  score: number;
}

export interface Question {
  text: string;
  options: number;
}

export interface SessionEntity {
  id: string; // Primary ID
  name: string;
  ownerId: string;
  currentUserId: string;
  started: boolean;
  questions: Question[];
  answers: string[];
  currentQuestion: Question;
  users: Record<string, SessionUser>
}
