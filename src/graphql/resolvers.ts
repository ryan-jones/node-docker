import {
  createProfile,
  getProfiles,
  getProfile,
  updateProfile,
  deleteProfile,
  IProfile
} from '../services/profile';
import { login } from '../services/auth';
import { checkAuth as check } from '../utils/validators';

interface ILogin {
  email: string;
  password: string;
}

export const resolvers = {
  Query: {
    profiles: (_: any, args, context) => check(context) && getProfiles(),
    profile: (_: any, args: { id: string }, context) =>
      check(context) && getProfile(args.id),
    login: (_: any, { email, password }: ILogin) => login(email, password)
  },
  Mutation: {
    insertProfile: (_: any, args: IProfile) => createProfile(args),
    updateProfile: (_: any, args: IProfile, context) =>
      check(context) && updateProfile(args),
    deleteProfile: (_: any, args: { id: string }, context) =>
      check(context) && deleteProfile(args.id)
  }
};
