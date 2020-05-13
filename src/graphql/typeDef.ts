import { gql } from "apollo-server-express";

export const typeDefs = gql`
	type Profile {
		id: ID!
		firstName: String!
		lastName: String!
		email: String!
		password: String!
	}
	input ProfileInput {
		firstName: String!
		lastName: String!
		email: String!
		password: String
	}
	type Country {
		id: ID!
		name: String!
		countryCode: String!
	}
	input CountryInput {
		name: String!
		countryCode: String!
	}

	type Nationality {
		id: ID!
		name: String!
		country: Country!
		visaFree: [Country]!
		visaOnArrival: [Country]!
		visaRequired: [Country]!
		noEntry: [Country]!
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
		countries: [Country!]!
	}
	type Mutation {
		insertProfile(profile: ProfileInput!): Profile!
		updateProfile(
			id: ID!
			firstName: String
			lastName: String
			email: String
			password: String
		): Profile!
		deleteProfile(id: ID!): Profile
		insertCountry(country: CountryInput!): Country!
		insertCountries(countries: [CountryInput]!): [Country!]!
		updateCountry(country: CountryInput!): Country!
	}
`;
