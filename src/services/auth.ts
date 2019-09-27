import Profile from '../models/profile';
import { UserInputError, ApolloError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function login(email: string, password: string) {
  try {
    const user = await Profile.findOne({ email });
    if (!user) {
      throw new UserInputError(`no user exists for ${email}`);
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      'somesupersecretkey',
      {
        expiresIn: '1h'
      }
    );
    return { profileId: user._id, token, tokenExpiration: 1 };
  } catch (err) {
    throw new ApolloError(err);
  }
}
