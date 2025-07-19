export interface User {
  localId: string;
  idToken: string;
  email: string;
  displayName?: string | null;
  isNewUser?: boolean;
}
