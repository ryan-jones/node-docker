import { gql } from "apollo-server-express";
import Country from "../models/country";
import {
	setClientWithContext,
	connectToDb,
	dropTestDb,
	closeDbConnection,
} from "../__testSetup__";
import { GraphQLError } from "graphql";
import { createTestClient } from "apollo-server-testing";

beforeAll(async () => {
	await connectToDb();
});

afterAll(async () => {
	await dropTestDb();
	await closeDbConnection();
});

const createCountry = gql`
	mutation createCountry($country: CountryInput!) {
		insertCountry(country: $country) {
			id
			name
			countryCode
		}
	}
`;

const getCountries = gql`
	query {
		countries {
			id
			name
			countryCode
		}
	}
`;

let id = "";

describe("Testing Country Queries and Mutations", () => {
	describe("when authenticated", () => {
		it("should create a unique country", async () => {
			const { mutate } = setClientWithContext(true);

			const res = await mutate({
				mutation: createCountry,
				variables: {
					country: {
						name: "United States of America",
						countryCode: "USA",
					},
				},
			});
			const country = await Country.findOne({ countryCode: "USA" });
			id = res.data.insertCountry.id;
			expect(res.data.insertCountry.name).toEqual("United States of America");
			expect(country).toBeTruthy();
		});

		it("should fetch all existing countries", async () => {
			const { query } = setClientWithContext(true);
			const { data } = await query({
				query: getCountries,
			});
			expect(data.countries).toHaveLength(1);
			expect(data.countries[0].name).toEqual("United States of America");
		});
	});

	describe("when not authenticated", () => {
		it("should prevent unathenticated users from creating country", async () => {
			const { mutate } = setClientWithContext(false);
			const { data, errors } = await mutate({
				mutation: createCountry,
				variables: {
					country: {
						name: "United States of America",
						countryCode: "USA",
					},
				},
			});
			expect(data).toBeNull();
			expect(errors).toEqual([new GraphQLError("You need to login first")]);
		});
	});
});
