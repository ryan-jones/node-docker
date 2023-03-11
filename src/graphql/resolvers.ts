import {
  createProfile,
  getProfiles,
  getProfile,
  updateProfile,
  deleteProfile,
} from '../services/profile';
import { login } from '../services/auth';
import { checkAuth as check } from '../utils/validators';
import {
  createCountry,
  createCountries,
  updateCountry,
  getCountries,
  getCountry,
} from '../services/country';
import { IAuth } from 'src/types/requests';
import { IProfile } from 'src/types/profile';
import { ICountry } from 'src/types/country';

interface ILogin {
  email: string;
  password: string;
}

export const resolvers = {
  Query: {
    profiles: (_: void, args: void, context: IAuth) =>
      check(context) && getProfiles(),
    profile: (_: void, args: { id: string }, context: IAuth) =>
      check(context) && getProfile(args.id),
    login: (_: void, { email, password }: ILogin) => login(email, password),
    countries: (_: void, args: void) => getCountries(),
    country: (_: void, args: { countryCode: string }) =>
      getCountry(args.countryCode),
  },
  Mutation: {
    insertProfile: (_: void, args: { profile: IProfile }) =>
      createProfile(args.profile),
    updateProfile: (_: void, args: IProfile, context: IAuth) =>
      check(context) && updateProfile(args),
    deleteProfile: (_: void, args: { id: string }, context: IAuth) =>
      check(context) && deleteProfile(args.id),
    insertCountry: (_: void, args: { country: ICountry }, context: IAuth) =>
      check(context) && createCountry(args.country),
    insertCountries: (
      _: void,
      args: { countries: ICountry[] },
      context: IAuth
    ) => check(context) && createCountries(args.countries),
    updateCountry: (_: void, args: { country: ICountry }, context: IAuth) =>
      check(context) && updateCountry(args.country),
  },
};
