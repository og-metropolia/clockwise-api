import { LoginUser, UserInput } from '@/types/DBTypes';
import userModel from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserContext } from '@/types/Context';
import companyModel from '../models/companyModel';

const saltRounds = 10;

require('dotenv').config();

export default {
  Query: {
    users: async () => {
      return userModel.find().select('-password');
    },
    user: async (_: any, args: { id: string }) => {
      return userModel.findById(args.id).select('-password');
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      args: {
        input: UserInput;
      },
    ) => {
      const managerUser = await userModel.findById(args.input.manager);
      const role = managerUser?.role === 'MANAGER' ? 'EMPLOYEE' : 'MANAGER';
      const manager =
        managerUser?.role === 'MANAGER' ? args.input.manager : null;

      const { email, password, first_name, last_name, language, company } =
        args.input;

      const validEmails = (
        await companyModel.find({ _id: company }).select('allowed_emails')
      )[0]?.allowed_emails;
      if (!validEmails?.includes(email)) throw new Error('Invalid email');

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = new userModel({
        email,
        password: hashedPassword,
        role,
        first_name,
        last_name,
        language,
        company,
        manager,
      });
      return await user.save();
    },
    updateUser: async (
      _: any,
      args: {
        id: string | null;
        input: Partial<UserInput>;
      },
      context: UserContext,
    ) => {
      if (args.input.password) {
        args.input.password = await bcrypt.hash(
          args.input.password,
          saltRounds,
        );
      }
      const { id, input } = args;

      if (!context.user) throw new Error('Not authenticated');

      if (context.user?.role === 'ADMIN') {
        return await userModel
          .findByIdAndUpdate(id, input, { new: true })
          .select('-password');
      }

      if (context.user?.role === 'MANAGER') {
        return await userModel
          .findOneAndUpdate({ _id: id, manager: context.user.id }, input, {
            new: true,
          })
          .select('-password');
      }

      if (!args.id)
        return await userModel
          .findOneAndUpdate({ _id: context.user.id }, input, {
            new: true,
          })
          .select('-password');

      throw new Error('Insufficient permissions');
    },
    deleteUser: async (_: any, args: { id: string }, context: UserContext) => {
      if (context.user?.role === 'ADMIN') {
        return await userModel.findByIdAndDelete(args.id).select('-password');
      }
      if (context.user?.role === 'MANAGER') {
        userModel.findOneAndDelete({ _id: args.id, manager: context.user.id });
        return await userModel.findByIdAndDelete(args.id).select('-password');
      }
    },
    login: async (
      _: any,
      args: {
        email: string;
        password: string;
      },
    ) => {
      const { email, password } = args;
      const user = await userModel.findOne({ email });

      if (!user) throw new Error('Invalid email or password');
      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new Error('Invalid email or password');

      const tokenContent = {
        id: user._id,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(tokenContent, process.env.JWT_SECRET as string);

      const message = {
        token,
        user: tokenContent,
      };

      return message;
    },
  },
  User: {
    manager: async (parent: LoginUser) => {
      return userModel.findById(parent.manager);
    },
  },
};
