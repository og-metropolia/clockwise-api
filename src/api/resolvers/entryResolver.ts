import { Entry } from '@/types/DBTypes';
import entryModel from '../models/entryModel';
import { UserContext } from '@/types/Context';

export default {
  Query: {
    entries: async (_: any, _args: any, context: UserContext) => {
      return entryModel.find({ user_id: context?.user?.id });
    },
    entry: async (_: any, args: { id: string }, context: UserContext) => {
      return entryModel.findOne({
        _id: args.id,
        user_id: context?.user?.id,
      });
    },
    entriesByType: async (
      _: any,
      args: { type: string },
      context: UserContext,
    ) => {
      return entryModel.find({
        user_id: context?.user?.id,
        type: args.type,
      });
    },
    entryLatestModified: async (
      _: any,
      _args: { input: { type: Pick<Entry, 'type'> } },
      context: UserContext,
    ) => {
      const result = await entryModel
        .find({ user_id: context?.user?.id, type: _args.input?.type })
        .sort({ updatedAt: -1 })
        .limit(1);
      return result.length > 0 ? result[0] : null;
    },
  },
  Mutation: {
    createEntry: async (
      _: any,
      args: {
        input: Omit<Entry, 'id' | 'user_id' | 'createdAt' | 'updatedAt'>;
      },
      context: UserContext,
    ) => {
      const { type, start_timestamp, end_timestamp } = args.input;
      return entryModel.create({
        user_id: context?.user?.id,
        type,
        start_timestamp,
        end_timestamp,
      });
    },
    updateEntry: async (
      _: any,
      args: {
        id: string;
        input: Partial<Omit<Entry, 'id'>>;
      },
      context: UserContext,
    ) => {
      const { id, input } = args;

      return entryModel.findOneAndUpdate(
        {
          _id: id,
          user_id: context?.user?.id,
        },
        input,
        { new: true },
      );
    },
    deleteEntry: async (_: any, args: { id: string }, context: UserContext) => {
      return entryModel.findOneAndDelete({
        _id: args.id,
        user_id: context?.user?.id,
      });
    },
  },
};
