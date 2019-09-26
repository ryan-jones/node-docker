import {
  createProfile,
  getProfiles,
  getProfile,
  IProfile
} from '../services/profile';

export const resolvers = {
  Query: {
    profiles: () => getProfiles(),
    profile: (_: any, params: { id: string }) => getProfile(params.id)
  },
  Mutation: {
    insertProfile: (_: any, params: IProfile) => createProfile(params)
  }
};
