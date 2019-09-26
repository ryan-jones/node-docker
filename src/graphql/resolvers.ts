import Profile from '../models/profile';
import { IProfile } from '../controllers/profile';
import mongoose from 'mongoose';

export const resolvers = {
  Query: {
    profiles: async () => {
      const result = await Profile.find();
      return result;
    },
    profile: async (_, params) => {
      const profile: IProfile = await Profile.findById(params.id);
      return profile ? profile : `Profile with id ${params.id} not found`;
    }
  },
  Mutation: {
    createProfile: async (_: any, params: any) => {
      // const required = ['firstName', 'lastName', 'email'];
      const newProfile = new Profile({
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName
      });
      await newProfile.save();
      return newProfile;
    }
  }
};
