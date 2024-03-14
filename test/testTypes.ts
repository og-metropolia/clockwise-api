import { Company, FullUser } from '../src/types/DBTypes';

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
type TestCompanyInput = Partial<
  Pick<TestCompany, 'name' | 'allowed_emails' | 'business_identity_code'>
>;

export type { TestUser, TestUserInput, TestCompany, TestCompanyInput };
