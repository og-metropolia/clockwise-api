import { Company, Entry, FullUser } from '../src/types/DBTypes';

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

type TestCompany = Partial<Company>;
type TestCompanyInput = Pick<
  TestCompany,
  'name' | 'allowed_emails' | 'business_identity_code'
>;

type TestEntry = Partial<Entry>;
type TestEntryInput = Pick<TestEntry, 'user_id' | 'type'> &
  Partial<{
    start_timestamp: string;
    end_timestamp: string;
  }>;

export type {
  TestUser,
  TestUserInput,
  TestCompany,
  TestCompanyInput,
  TestEntry,
  TestEntryInput,
};
