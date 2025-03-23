export enum UserVariant {
  Admin,
  User,
  Guest,
}

export type User = {
  id: number;
  email: string;
  username: string;
};
