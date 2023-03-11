import Profile from '../models/profile';
import {
  ApolloError,
  UserInputError,
  ForbiddenError,
} from 'apollo-server-express';
import bcrypt from 'bcryptjs';
import { IProfile } from 'src/types/profile';

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
  const { email, password, firstName, lastName } = params;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newProfile = new Profile({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });
    const result = await newProfile.save();
    return result;
  } catch (err) {
    throw new ForbiddenError('User already exists');
  }
}

export async function updateProfile(params: IProfile): Promise<IProfile> {
  if (params.password) {
    params.password = await bcrypt.hash(params.password, 12);
  }
  try {
    const result: IProfile = await Profile.findOneAndUpdate(
      { _id: params.id },
      { $set: { ...params } },
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
