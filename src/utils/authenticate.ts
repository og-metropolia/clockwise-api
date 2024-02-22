import { Request } from 'express';
import { UserContext } from '../types/Context';
import jwt from 'jsonwebtoken';
import { LoginUser } from '../types/DBTypes';

export default async function (req: Request): Promise<UserContext> {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const token = authHeader.split(' ')[1];
      if (!token) return {};
      const jtwSecret = process.env.JWT_SECRET;
      if (!jtwSecret) throw new Error('JWT_SECRET not defined');
      const userFromToken = jwt.verify(token, jtwSecret) as LoginUser;
      if (!userFromToken) return {};
      return { token: token, user: userFromToken };
    } catch (error) {
      return {};
    }
  }
  return {};
}
