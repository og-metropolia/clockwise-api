import request from 'supertest';
import { Application } from 'express';
import { TestCompany, TestCompanyInput } from './testTypes';

const getCompany = (url: string | Application): Promise<TestCompany[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query Companies {
          companies {
            id
            name
            business_identity_code
            allowed_emails
            employees { id }
            managers { id }
          }
        }`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const companies = response.body.data.companies;
          expect(companies).toBeInstanceOf(Array);
          expect(companies[0]).toHaveProperty('id');
          expect(companies[0]).toHaveProperty('name');
          expect(companies[0]).toHaveProperty('business_identity_code');
          expect(companies[0]).toHaveProperty('allowed_emails');
          expect(companies[0]).toHaveProperty('employees');
          expect(companies[0]).toHaveProperty('managers');
          resolve(companies);
        }
      });
  });
};

const getSingleCompany = (
  url: string | Application,
  id: string,
): Promise<TestCompany> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query GetCompany($companyId: ID!) {
          company(id: $companyId) {
            id
            name
            business_identity_code
            allowed_emails
            employees { id }
            managers { id }
          }
        }`,
        variables: {
          companyId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const company = response.body.data.company;
          expect(company).toHaveProperty('id');
          expect(company).toHaveProperty('name');
          expect(company).toHaveProperty('business_identity_code');
          expect(company).toHaveProperty('allowed_emails');
          expect(company).toHaveProperty('employees');
          expect(company).toHaveProperty('managers');
          resolve(company);
        }
      });
  });
};

const createCompany = (
  url: string | Application,
  company: TestCompanyInput,
  token: string,
): Promise<TestCompany> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation CompanyCreate($input: InputCompany) {
          createCompany(input: $input) { id name allowed_emails business_identity_code }
        }`,
        variables: {
          input: company,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const companyResponse = response.body.data.createCompany;
          expect(companyResponse).toHaveProperty('id');
          expect(companyResponse).toHaveProperty('name');
          expect(companyResponse).toHaveProperty('allowed_emails');
          expect(companyResponse).toHaveProperty('business_identity_code');
          resolve(companyResponse);
        }
      });
  });
};

const updateCompany = (
  url: string | Application,
  id: string,
  token: string,
) => {
  const newData = {
    name: 'Updated Company',
    allowed_emails: ['@test.test', '@updated.test'],
    business_identity_code: '22222222222',
  };
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation UpdateCompany($updateCompanyId: ID!, $input: UpdateCompany) {
          updateCompany(id: $updateCompanyId, input: $input) { id name allowed_emails business_identity_code }
        }`,
        variables: {
          updateCompanyId: id,
          input: newData,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const companyData = response.body.data.updateCompany;
          expect(companyData).toHaveProperty('id');
          expect(companyData.name).toBe(newData.name);
          expect(companyData.allowed_emails).toEqual(newData.allowed_emails);
          expect(companyData.business_identity_code).toBe(
            newData.business_identity_code,
          );
          resolve(companyData);
        }
      });
  });
};

const deleteCompany = (
  url: string | Application,
  id: string,
  token: string,
): Promise<TestCompany> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation DeleteCompany($deleteCompanyId: ID!) {
          deleteCompany(id: $deleteCompanyId) { id name }
        }`,
        variables: {
          deleteCompanyId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const companyData = response.body.data.deleteCompany;
          expect(companyData).toHaveProperty('id');
          expect(companyData).toHaveProperty('name');
          resolve(companyData);
        }
      });
  });
};

export {
  getCompany,
  getSingleCompany,
  createCompany,
  updateCompany,
  deleteCompany,
};
