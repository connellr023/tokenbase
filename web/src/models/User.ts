export enum UserVariant {
  Admin,
  User,
  Guest,
}

export type GenericUser = {
  id: number;
  email: string;
  username: string;
};
