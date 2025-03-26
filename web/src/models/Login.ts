import User from "./User";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  jwt: string;
  user: User;
};
