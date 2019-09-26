import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Profile {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }
  type Query {
    profiles: [Profile!]!
    profile(id: ID!): Profile!
  }
  type Mutation {
    createProfile(
      firstName: String!
      lastName: String!
      email: String!
    ): Profile!
  }
`;
