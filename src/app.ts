import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { notFound, errorHandler } from './middlewares';
import { MessageResponse } from './types/MessageTypes';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from './api/schemas/index';
import resolvers from './api/resolvers/index';
import { UserContext } from './types/Context';
import authenticate from './utils/authenticate';
import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  constraintDirectiveTypeDefs,
  createApollo4QueryValidationPlugin,
} from 'graphql-constraint-directive/apollo4';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageGraphQLPlayground
} from '@apollo/server/plugin/landingPage/default';

require('dotenv').config();

const app = express();

(async () => {
  try {
    app.use(
      helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: false,
      }),
    );
    app.use(cors());

    app.get('/', (_req: Request, res: Response<MessageResponse>) => {
      res.send({ message: 'Server is running' });
    });

    const schema = makeExecutableSchema({
      typeDefs: [constraintDirectiveTypeDefs, typeDefs],
      resolvers,
    });

    const server = new ApolloServer<UserContext>({
      schema,
      plugins: [
        createApollo4QueryValidationPlugin(),
        ApolloServerPluginLandingPageGraphQLPlayground()
        process.env.NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageProductionDefault()
          : ApolloServerPluginLandingPageLocalDefault(),
      ],
    });

    await server.start();

    app.use(
      '/graphql',
      cors(),
      express.json(),
      expressMiddleware(server, {
        context: ({ req }) => authenticate(req),
      }),
    );

    app.use(notFound);
    app.use(errorHandler);
  } catch (error) {
    console.error((error as Error).message);
  }
})();

export default app;
