export type Role = 'EMPLOYEE' | 'MANAGER' | 'ADMIN';
export type Language = 'en' | 'fi' | 'sv';

export type FullUser = {
  id: string;
  email: string;
  password: string;
  role: Role;
  first_name: string;
  last_name: string;
  job_title?: string;
  phone?: string;
  language: Language;
  profile_picture?: string;
  manager?: string;
  createdAt: Date;
  updatedAt: Date;
  company: Company;
};

export type LoginUser = Omit<FullUser, 'password'>;

export type TokenUser = Pick<FullUser, 'id' | 'email' | 'role'>;

export type UserInput = Pick<
  FullUser,
  'email' | 'password' | 'first_name' | 'last_name' | 'language'
> & {
  company: string;
  manager: string;
};

export type EntryType =
  | 'working'
  | 'sick_child'
  | 'holiday_leave'
  | 'special_leave'
  | 'sick_leave'
  | 'unpaid_leave'
  | 'other';

export type Entry = {
  id: string;
  user_id: string;
  start_timestamp: Date;
  end_timestamp: Date;
  type: EntryType;
  createdAt: Date;
  updatedAt: Date;
};

export type Company = {
  id: string;
  name: string;
  allowed_emails: string[];
  business_identity_code: string;
  employees: LoginUser[];
  managers: LoginUser[];
  createdAt: Date;
  updatedAt: Date;
};
