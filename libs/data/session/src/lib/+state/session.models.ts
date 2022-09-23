/**
 * Interface for the 'Session' data
 */

export interface SessionUser {
  name: string;
  imageUrl?: string;
}

export interface SessionEntity {
  id: string; // Primary ID
  name: string;
  ownerId: string;
  users: Record<string, SessionUser>
}

export interface CreateSessionPayload {
  name: string;
  ownerId: string;
  users: Record<string, SessionUser>;
}
