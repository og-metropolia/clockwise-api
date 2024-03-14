/* eslint-disable */
import app from '../src/app';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {
  deleteUser,
  getSingleUser,
  getUser,
  loginUser,
  createUser,
  updateUser,
} from './userFunctions';
import { getNotFound } from './testFunctions';
import { TestUserInput } from './testTypes';
import { UserContext } from '@/types/Context';
import randomstring from 'randomstring';
import dotenv from 'dotenv';
dotenv.config();

describe('Graphql API', () => {
  beforeAll(async () => {
    if (!process.env.TEST_ADMIN_EMAIL || !process.env.TEST_ADMIN_PASSWORD) {
      throw new Error(
        'Missing environment variables. Please set the following: TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD',
      );
    }

    await mongoose.connect(process.env.DATABASE_URL as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should respond with a not found message', async () => {
    await getNotFound(app);
  });

  let managerData: UserContext;

  // @ts-ignore
  let employeeData: UserContext;
  // @ts-ignore
  let adminData: UserContext;

  const adminUser: TestUserInput = {
    email: process.env.TEST_ADMIN_EMAIL,
    password: process.env.TEST_ADMIN_PASSWORD,
  };

  const COMPANY_ID = '65f19f33fb7973630e4e7923'; // TODO: get by creating new company

  const testManagerUser: TestUserInput = {
    email:
      randomstring.generate({ length: 9, charset: 'alphabetic' }) +
      '@test.test',
    password: 'testpassword',
    first_name: 'Test ' + randomstring.generate(7),
    last_name: 'Tester ' + randomstring.generate(7),
    language: 'en',
    company: COMPANY_ID,
  };
  let managerResponse: any;

  it('should create manager user', async () => {
    managerResponse = await createUser(app, testManagerUser);
  });

  let testEmployeeUser: TestUserInput = {};
  it('should create employee user', async () => {
    testEmployeeUser = {
      email:
        randomstring.generate({ length: 9, charset: 'alphabetic' }) +
        '@test.test',
      password: 'testpassword',
      first_name: 'Test ' + randomstring.generate(7),
      last_name: 'Tester ' + randomstring.generate(7),
      language: 'en',
      company: COMPANY_ID,
      manager: managerResponse.id,
    };
    await createUser(app, testEmployeeUser);
  });

  it('should login admin', async () => {
    const vars = {
      email: adminUser.email!,
      password: adminUser.password!,
    };
    adminData = await loginUser(app, vars);
  });

  it('should login manager', async () => {
    const vars = {
      email: testManagerUser.email!,
      password: testManagerUser.password!,
    };
    managerData = await loginUser(app, vars);
  });

  it('should login employee', async () => {
    const vars = {
      email: testEmployeeUser.email!,
      password: testEmployeeUser.password!,
    };
    employeeData = await loginUser(app, vars);
  });

  it('token should have role', async () => {
    const dataFromToken = jwt.verify(
      managerData.token!,
      process.env.JWT_SECRET as string,
    );
    expect(dataFromToken).toHaveProperty('role');
  });

  it('should get array of users', async () => {
    await getUser(app);
  });

  it('should get single user', async () => {
    await getSingleUser(app, managerData.user?.id!);
  });

  it('should update user', async () => {
    await updateUser(app, employeeData.token!);
  });

  it('should delete employee', async () => {
    await deleteUser(app, employeeData.user?.id!, managerData.token!);
  });

  it('should delete manager', async () => {
    await deleteUser(app, managerData.user?.id!, adminData.token!);
  });
});
