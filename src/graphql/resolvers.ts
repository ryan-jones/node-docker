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
import {
  ICountry,
  createCountry,
  createCountries,
  updateCountry,
  getCountries
} from '../services/country';

interface ILogin {
  email: string;
  password: string;
}

export const resolvers = {
  Query: {
    profiles: (_: any, args, context) => check(context) && getProfiles(),
    profile: (_: any, args: { id: string }, context) =>
      check(context) && getProfile(args.id),
    login: (_: any, { email, password }: ILogin) => login(email, password),
    countries: (_: any, args) => getCountries()
  },
  Mutation: {
    insertProfile: (_: any, args: { profile: IProfile }) =>
      createProfile(args.profile),
    updateProfile: (_: any, args: IProfile, context) =>
      check(context) && updateProfile(args),
    deleteProfile: (_: any, args: { id: string }, context) =>
      check(context) && deleteProfile(args.id),
    insertCountry: (_: any, args: { country: ICountry }, context) =>
      createCountry(args.country),
    insertCountries: (_: any, args: { countries: ICountry[] }, context) =>
      createCountries(args.countries),
    updateCountry: (_: any, args: { country: ICountry }, context) =>
      updateCountry(args.country)
  }
};
