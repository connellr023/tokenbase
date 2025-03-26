import User from "./User";

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  jwt: string;
  user: User;
};
