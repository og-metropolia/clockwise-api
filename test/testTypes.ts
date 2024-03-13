import { FullUser } from '../src/types/DBTypes';

type TestUser = Partial<FullUser>;
type TestUserInput = Partial<
  Pick<
    TestUser,
    'email' | 'password' | 'first_name' | 'last_name' | 'language'
  > & {
    company: string;
    manager: string;
  }
>;

export type { TestUser, TestUserInput };
