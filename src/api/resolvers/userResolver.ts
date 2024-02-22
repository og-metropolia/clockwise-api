import { User, UserInput } from '@/types/DBTypes';
import userModel from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserContext } from '@/types/Context';

const saltRounds = 10;

require('dotenv').config();

export default {
  Query: {
    users: async () => {
      return userModel.find();
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
        id: string;
        input: Partial<UserInput>;
      },
    ) => {
      if (args.input.password) {
        args.input.password = await bcrypt.hash(
          args.input.password,
          saltRounds,
        );
      }
      const { id, input } = args;
      return await userModel
        .findByIdAndUpdate(id, input, { new: true })
        .select('-password');
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
    manager: async (parent: User) => {
      return userModel.findById(parent.manager);
    },
  },
};
