import Profile from '../models/profile';
import { badRequest } from '../utils/errorHandlers';
import { checkReqInvalid } from '../utils/validators';
import { ApolloError, UserInputError } from 'apollo-server-express';

export interface IProfile {
  firstName: string;
  lastName: string;
  email: string;
  id?: string;
}

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
  const required = ['firstName', 'lastName', 'email'];
  if (checkReqInvalid(params, required)) {
    badRequest(required.filter((value: string) => params[value] === undefined));
  }
  try {
    const newProfile = new Profile({
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName
    });
    await newProfile.save();
    return newProfile;
  } catch (err) {
    throw new ApolloError('There was a server error when saving profile');
  }
}

export async function updateProfile(params: IProfile): Promise<IProfile> {
  const { firstName, lastName, email, id } = params;
  try {
    const result: IProfile = await Profile.findOneAndUpdate(
      { _id: id },
      { $set: { firstName, lastName, email } },
      { new: true }
    );
    return result;
  } catch (err) {
    throw new UserInputError(`Profile with id ${id} not found`);
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
