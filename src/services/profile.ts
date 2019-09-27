import Profile from '../models/profile';
import { checkReqInvalid, checkAuth } from '../utils/validators';
import {
  ApolloError,
  UserInputError,
  ForbiddenError
} from 'apollo-server-express';
import bcrypt from 'bcryptjs';

export interface IProfile {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  id?: string;
}

export interface IRequest extends Request {
  isAuth: boolean;
}

const required = ['firstName', 'lastName', 'email', 'password'];

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

  try {
    const existingProfile = await Profile.findOne({ email: params.email });
    if (existingProfile) {
      throw new ForbiddenError('User already exists');
    }
    const hashedPassword = await bcrypt.hash(params.password, 12);
    const newProfile = new Profile({
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      password: hashedPassword
    });
    await newProfile.save();
    return { ...newProfile, password: '' };
  } catch (err) {
    throw new ApolloError(err);
  }
}

export async function updateProfile(params: IProfile): Promise<IProfile> {
  const updatedValues = required.reduce((values: any, value: string) => {
    return params[value] !== undefined
      ? { ...values, [value]: params[value] }
      : values;
  }, {});
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
