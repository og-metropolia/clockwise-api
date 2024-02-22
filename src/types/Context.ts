import { LoginUser } from './DBTypes';

export type UserContext = {
  user?: LoginUser;
  token?: string;
};
