import { GraphQLError } from 'graphql';
import { UserContext } from '../types/Context';

const isLogged = (context: UserContext) => {
  if (!context) {
    throw new GraphQLError('Not authenticated', {
      extensions: { code: 'UNAUTHORIZED', http: { status: 401 } },
    });
  }
};

const isLoggedAsAdmin = (context: UserContext) => {
  if (context.user?.role !== 'ADMIN') {
    throw new GraphQLError('Not authorized', {
      extensions: { code: 'UNAUTHORIZED', http: { status: 401 } },
    });
  }
};

export { isLogged, isLoggedAsAdmin };
