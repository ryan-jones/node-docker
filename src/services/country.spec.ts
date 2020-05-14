import { gql } from "apollo-server-express";
import Country from "../models/country";
import {
	setClientWithContext,
	connectToDb,
	dropTestDb,
	closeDbConnection,
} from "../testSetup";
import { GraphQLError } from "graphql";

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

const createCountries = gql`
	mutation createCountries($countries: [CountryInput]!) {
		insertCountries(countries: $countries) {
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

const getCountry = gql`
	query getCountry($countryCode: String!) {
		country(countryCode: $countryCode) {
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

		it("should create multiple unique countries at one time", async () => {
			const { mutate } = setClientWithContext(true);
			const res = await mutate({
				mutation: createCountries,
				variables: {
					countries: [
						{
							name: "United Kingdom",
							countryCode: "UK",
						},
						{
							name: "Japan",
							countryCode: "JPN",
						},
						{
							name: "Canada",
							countryCode: "CAN",
						},
					],
				},
			});
			expect(res.data.insertCountries).toHaveLength(3);
			expect(res.data.insertCountries[0].name).toEqual("United Kingdom");
		});

		it("should filter existing countries when inserting multiple countries at one time", async () => {
			const { mutate } = setClientWithContext(true);
			const res = await mutate({
				mutation: createCountries,
				variables: {
					countries: [
						{
							name: "United Kingdom",
							countryCode: "UK",
						},
						{
							name: "Taiwan",
							countryCode: "TW",
						},
						{
							name: "France",
							countryCode: "FR",
						},
					],
				},
			});
			expect(res.data.insertCountries).toHaveLength(2);
			expect(res.data.insertCountries[0].name).toEqual("Taiwan");
		});

		it("should fetch all existing countries", async () => {
			const { query } = setClientWithContext(true);
			const { data } = await query({
				query: getCountries,
			});
			expect(data.countries).toHaveLength(6);
			expect(data.countries[0].name).toEqual("United States of America");
		});

		it("should fetch selected valid country", async () => {
			const { query } = setClientWithContext(true);
			const { data } = await query({
				query: getCountry,
				variables: {
					countryCode: "USA",
				},
			});
			expect(data.country.name).toEqual("United States of America");
		});

		it("should reject a request for a country that does not yet exist", async () => {
			const { query } = setClientWithContext(true);
			const res = await query({
				query: getCountry,
				variables: {
					countryCode: "ESP",
				},
			});
			expect(res.errors).toEqual([
				new GraphQLError("UserInputError: Country does not exist"),
			]);
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
