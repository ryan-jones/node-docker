import {
  createProfile,
  getProfiles,
  getProfile,
  updateProfile,
  deleteProfile,
  IProfile
} from '../services/profile';

export const resolvers = {
  Query: {
    profiles: () => getProfiles(),
    profile: (_: any, params: { id: string }) => getProfile(params.id)
  },
  Mutation: {
    insertProfile: (_: any, params: IProfile) => createProfile(params),
    updateProfile: (_: any, params: IProfile) => updateProfile(params),
    deleteProfile: (_: any, params: { id: string }) => deleteProfile(params.id)
  }
};
