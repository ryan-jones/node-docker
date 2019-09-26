import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Profile {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }
  type Query {
    profiles: [Profile]!
    profile(id: ID!): Profile
  }
  type Mutation {
    insertProfile(
      firstName: String!
      lastName: String!
      email: String!
    ): Profile!
    updateProfile(
      id: ID!
      firstName: String
      lastName: String
      email: String
    ): Profile!
    deleteProfile(id: ID!): Profile
  }
`;
