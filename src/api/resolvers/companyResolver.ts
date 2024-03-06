import { Company, FullUser } from '@/types/DBTypes';
import companyModel from '../models/companyModel';
import userModel from '../models/userModel';
import { UserContext } from '@/types/Context';
import { GraphQLError } from 'graphql';

export default {
  Query: {
    companies: async () => {
      return companyModel.find();
    },
    company: async (_: any, args: { id: string }) => {
      return companyModel.findById(args.id);
    },
  },
  Mutation: {
    createCompany: async (
      _: any,
      args: {
        input: Omit<Company, 'id'>;
      },
      context: UserContext,
    ) => {
      if (context?.user?.role !== 'ADMIN') {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 'UNAUTHORIZED', http: { status: 401 } },
        });
      }

      const { name, allowed_emails, business_identity_code } = args.input;
      return companyModel.create({
        name,
        allowed_emails,
        business_identity_code,
      });
    },
    updateCompany: async (
      _: any,
      args: {
        id: string;
        input: Partial<Omit<Company, 'id'>>;
      },
      context: UserContext,
    ) => {
      if (
        context?.user?.role !== 'MANAGER' ||
        context?.user?.company?.id !== args.id
      ) {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 'UNAUTHORIZED', http: { status: 401 } },
        });
      }

      const { id, input } = args;
      return companyModel.findByIdAndUpdate(id, input, { new: true });
    },
    deleteCompany: async (
      _: any,
      args: { id: string },
      context: UserContext,
    ) => {
      if (context?.user?.role !== 'ADMIN') {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 'UNAUTHORIZED', http: { status: 401 } },
        });
      }
      userModel.deleteMany({ company: args.id });
      return companyModel.findByIdAndDelete(args.id);
    },
  },
  User: {
    company: async (parent: FullUser) => {
      return companyModel.findById(parent.company);
    },
  },
};
