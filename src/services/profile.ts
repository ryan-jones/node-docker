import Profile from '../models/profile';
import { checkReqInvalid } from '../utils/validators';
import {
  ApolloError,
  UserInputError,
  ForbiddenError
} from 'apollo-server-express';
import bcrypt from 'bcryptjs';
import Country from '../models/country';
import { ICountry } from './country';
import { setUpdatedValues } from 'src/utils/updateHandlers';

export interface IProfile {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  nationalities: any[];
  id?: string;
}

export interface IRequest extends Request {
  isAuth: boolean;
}

const required = [
  'firstName',
  'lastName',
  'email',
  'password',
  'nationalities'
];

export async function getProfiles(): Promise<IProfile[]> {
  try {
    const result: IProfile[] = await Profile.find();
    return result;
  } catch (err) {
    throw new ApolloError(
      'There was a server error when querying for profiles'
    );
  }
}

export async function getProfile(id: string): Promise<IProfile> {
  try {
    const profile: IProfile = await Profile.findById(id);
    return profile;
  } catch (err) {
    throw new UserInputError(`Profile with id ${id} not found`);
  }
}

export async function createProfile(params: IProfile): Promise<IProfile> {
  checkReqInvalid(params, required);
  const { email, password, firstName, lastName } = params;
  try {
    const existingProfile = await Profile.findOne({ email });
    if (existingProfile) {
      throw new ForbiddenError('User already exists');
    }
    const hashedPassword = await bcrypt.hash(params.password, 12);
    const nationalities: ICountry[] = await Promise.all(
      params.nationalities.map(async (nationality: string) => {
        const { name, countryCode } = await Country.findOne({
          _id: nationality
        });
        return {
          name,
          countryCode
        };
      })
    );
    const newProfile = new Profile({
      email,
      firstName,
      lastName,
      nationalities,
      password: hashedPassword
    });
    const result = await newProfile.save();
    return result;
  } catch (err) {
    throw new ApolloError(err);
  }
}

export async function updateProfile(params: IProfile): Promise<IProfile> {
  const updatedValues = setUpdatedValues(params, required);
  if (updatedValues.password) {
    updatedValues.password = await bcrypt.hash(updatedValues.password, 12);
  }
  try {
    const result: IProfile = await Profile.findOneAndUpdate(
      { _id: params.id },
      { $set: { ...updatedValues } },
      { new: true }
    );
    return result;
  } catch (err) {
    throw new UserInputError(`Profile with id ${params.id} not found`);
  }
}

export async function deleteProfile(id: string): Promise<IProfile> {
  try {
    const result: IProfile = await Profile.findOneAndRemove({ _id: id });
    return result;
  } catch (err) {
    throw new UserInputError(`Profile with id ${id} not found`);
  }
}
