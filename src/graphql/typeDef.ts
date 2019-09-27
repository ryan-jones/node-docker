import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Profile {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
  type AuthData {
    profileId: ID!
    token: String!
    tokenExpiration: Int!
  }
  type Query {
    profiles: [Profile]!
    profile(id: ID!): Profile
    login(email: String!, password: String!): AuthData!
  }
  type Mutation {
    insertProfile(
      firstName: String!
      lastName: String!
      email: String!
      password: String
    ): Profile
    updateProfile(
      id: ID!
      firstName: String
      lastName: String
      email: String
      password: String
    ): Profile!
    deleteProfile(id: ID!): Profile
  }
`;
