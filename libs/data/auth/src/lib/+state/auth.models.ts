/**
 * Interface for the 'Auth' data
 */

export interface User {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface AuthEntity {
  user?: User;
  loading: boolean;
  loaded: boolean;
  error: string;
}
