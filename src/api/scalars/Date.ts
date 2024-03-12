import { GraphQLScalarType } from 'graphql';

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  parseValue(value: unknown) {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return null;
  },
  serialize(value: unknown) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return null;
  },
});

export default dateScalar;
