import userResolver from './userResolver';
import companyResolver from './companyResolver';
import entryResolver from './entryResolver';
import dateScalar from '../scalars/Date';

export default [
  userResolver,
  companyResolver,
  entryResolver,
  { Date: dateScalar },
];
