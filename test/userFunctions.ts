import request from 'supertest';
import randomstring from 'randomstring';
import { Application } from 'express';
import { TestUser, TestUserInput } from './testTypes';
import { FullUser, Language, Role } from '@/types/DBTypes';
import { UserContext } from '@/types/Context';

const ROLES: Role[] = ['EMPLOYEE', 'MANAGER', 'ADMIN'];
const LANGUAGES: Language[] = ['en', 'fi', 'sv'];

const getUser = (url: string | Application): Promise<TestUser[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query Users {
          users { id email role first_name last_name language }
        }`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const users = response.body.data.users;
          expect(users).toBeInstanceOf(Array);
          expect(users[0]).toHaveProperty('id');
          expect(users[0]).toHaveProperty('email');
          expect(users[0]).toHaveProperty('role');
          expect(ROLES.includes(users[0]?.role)).toBe(true);
          expect(users[0]).toHaveProperty('first_name');
          expect(users[0]).toHaveProperty('last_name');
          expect(users[0]).toHaveProperty('language');
          resolve(users);
        }
      });
  });
};

const getSingleUser = (
  url: string | Application,
  id: string,
): Promise<TestUser> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query UserById($userId: ID!) {
          user(id: $userId) { id email role first_name last_name language }
        }`,
        variables: {
          userId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const user = response.body.data.user;
          expect(user).toHaveProperty('id');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('role');
          expect(ROLES.includes(user?.role)).toBe(true);
          expect(user).toHaveProperty('first_name');
          expect(user).toHaveProperty('last_name');
          expect(user).toHaveProperty('language');
          expect(LANGUAGES.includes(user?.language)).toBe(true);
          resolve(user);
        }
      });
  });
};

const createUser = (
  url: string | Application,
  user: TestUserInput,
): Promise<TestUser> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `mutation CreateUser($input: UserInput!) {
        createUser(input: $input) { id email role first_name last_name language manager company }
      }`,
        variables: {
          input: user,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userResponse = response.body.data.createUser;
          expect(userResponse).toHaveProperty('id');
          expect(userResponse.email).toBe(user.email);
          // expect(userResponse.role).toBe(user.role);
          expect(userResponse.first_name).toBe(user.first_name);
          expect(userResponse.last_name).toBe(user.last_name);
          expect(userResponse.language).toBe(user.language);
          expect(userResponse.manager).toBe(user.manager ?? null);
          expect(userResponse.company).toBe(user.company ?? null);
          resolve(userResponse);
        }
      });
  });
};

const loginUser = (
  url: string | Application,
  vars: Pick<FullUser, 'email' | 'password'>,
): Promise<UserContext> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
            user { id email role }
          }
        }`,
        variables: {
          email: vars.email,
          password: vars.password,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.login;
          expect(userData).toHaveProperty('token');
          expect(userData).toHaveProperty('user');
          expect(userData.user).toHaveProperty('id');
          expect(userData.user.email).toBe(vars.email);
          expect(ROLES.includes(userData.user.role)).toBe(true);
          resolve(userData);
        }
      });
  });
};

const updateUser = (url: string | Application, token: string) => {
  return new Promise((resolve, reject) => {
    const newData = {
      email: 'Test User ' + randomstring.generate(7) + '@test.test',
      first_name: randomstring.generate(3),
      last_name: randomstring.generate(7),
      job_title: 'Tester',
      phone: '123456789',
      language: 'sv',
      profile_picture: 'https://example.com/test.jpg',
    };

    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation UpdateUser($input: UpdateUser!) {
          updateUser(input: $input) { id email first_name last_name job_title phone language profile_picture role }
        }`,
        variables: {
          input: newData,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.updateUser;
          expect(userData).toHaveProperty('id');
          expect(userData.email).toBe(newData.email);
          expect(userData.first_name).toBe(newData.first_name);
          expect(userData.last_name).toBe(newData.last_name);
          expect(userData.job_title).toBe(newData.job_title);
          expect(userData.phone).toBe(newData.phone);
          expect(userData.language).toBe(newData.language);
          expect(userData.profile_picture).toBe(newData.profile_picture);
          expect(ROLES.includes(userData.role)).toBe(true);
          resolve(userData);
        }
      });
  });
};

const deleteUser = (
  url: string | Application,
  id: string,
  token: string,
): Promise<TestUser> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation DeleteUser($deleteUserId: ID!) {
          deleteUser(id: $deleteUserId) { id email }
        }`,
        variables: {
          deleteUserId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.deleteUser;
          expect(userData).toHaveProperty('id');
          expect(userData).toHaveProperty('email');
          resolve(userData);
        }
      });
  });
};

export {
  getUser,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
};
