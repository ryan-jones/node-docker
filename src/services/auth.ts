import Profile from '../models/profile';
import { UserInputError, ApolloError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function login(email: string, password: string) {
  try {
    const user = await Profile.findOne({ email });
    if (!user) {
      throw new UserInputError('Cannot signin');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new UserInputError('Cannot signin');
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      'somesupersecretkey',
      {
        expiresIn: '1h',
      }
    );
    return { profileId: user._id, token, tokenExpiration: 1 };
  } catch (err) {
    throw new ApolloError(err);
  }
}
