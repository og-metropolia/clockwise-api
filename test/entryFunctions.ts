import request from 'supertest';
import { Application } from 'express';
import { TestEntry, TestEntryInput } from './testTypes';

const getEntry = (
  url: string | Application,
  token: string,
): Promise<TestEntry[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `query Entries {
          entries { id user_id type start_timestamp end_timestamp }
        }`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const entries = response.body.data.entries;
          expect(entries).toBeInstanceOf(Array);
          expect(entries[0]).toHaveProperty('id');
          expect(entries[0]).toHaveProperty('user_id');
          expect(entries[0]).toHaveProperty('type');
          expect(entries[0]).toHaveProperty('start_timestamp');
          expect(entries[0]).toHaveProperty('end_timestamp');
          resolve(entries);
        }
      });
  });
};

const getSingleEntry = (
  url: string | Application,
  id: string,
): Promise<TestEntry> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query Entry($entryId: ID!) {
          entry(id: $entryId) { id user_id type start_timestamp end_timestamp }
        }`,
        variables: {
          entryId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const entry = response.body.data.entry;
          expect(entry).toHaveProperty('id');
          expect(entry).toHaveProperty('user_id');
          expect(entry).toHaveProperty('type');
          expect(entry).toHaveProperty('start_timestamp');
          expect(entry).toHaveProperty('end_timestamp');
          resolve(entry);
        }
      });
  });
};

const createEntry = (
  url: string | Application,
  entry: TestEntryInput,
  token: string,
): Promise<TestEntry> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation CreateEntry($input: InputEntry) {
          createEntry(input: $input) { id user_id type start_timestamp }
        }`,
        variables: {
          input: entry,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('rep body data', response.body.data);
          const entryResponse = response.body.data.createEntry;
          expect(entryResponse).toHaveProperty('id');
          expect(entryResponse).toHaveProperty('user_id');
          expect(entryResponse).toHaveProperty('type');
          expect(entryResponse).toHaveProperty('start_timestamp');
          resolve(entryResponse);
        }
      });
  });
};

const updateEntry = (url: string | Application, id: string, token: string) => {
  const newData = {
    type: 'other',
    end_timestamp: new Date().toISOString(),
  };
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation UpdateEntry($id: ID!, $input: UpdateEntry) {
          updateEntry(id: $id, input: $input) { id type end_timestamp }
        }`,
        variables: {
          updateEntryId: id,
          input: newData,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const entryData = response.body.data.updateEntry;
          expect(entryData).toHaveProperty('id');
          expect(entryData.type).toBe(newData.type);
          expect(entryData.end_timestamp).toBe(newData.end_timestamp);
          resolve(entryData);
        }
      });
  });
};

const deleteEntry = (
  url: string | Application,
  id: string,
  token: string,
): Promise<TestEntry> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($deleteEntryId: ID!) {
          deleteEntry(id: $deleteEntryId) { id user_id type }
        }`,
        variables: {
          deleteEntryyId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const entryData = response.body.data.deleteEntry;
          expect(entryData).toHaveProperty('id');
          expect(entryData).toHaveProperty('user_id');
          expect(entryData).toHaveProperty('type');
          resolve(entryData);
        }
      });
  });
};

export { getEntry, getSingleEntry, createEntry, updateEntry, deleteEntry };
