import { gql } from "apollo-server-express";
import Profile from "../models/profile";
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

let id = "";

describe("Testing Profile Queries and Mutations", () => {
	describe("Create Profile", () => {
		const { mutate } = setClientWithContext(true);
		const createProfile = gql`
			mutation insertProfile($profile: ProfileInput!) {
				insertProfile(profile: $profile) {
					firstName
					lastName
					id
				}
			}
		`;
		const profile = {
			firstName: "John",
			lastName: "Doe",
			email: "johndoe@example.com",
			password: "mypassword",
		};

		it("should successfully create a new profile with valid credentials", async () => {
			const { data } = await mutate({
				mutation: createProfile,
				variables: {
					profile,
				},
			});
			const user = await Profile.findOne({ email: "johndoe@example.com" });
			id = data.insertProfile.id;
			expect(data.insertProfile.firstName).toEqual("John");
			expect(user.firstName).toBeTruthy;
			expect(user.firstName).toEqual("John");
		});

		it("should not create two profiles with the same email", async () => {
			const res = await mutate({
				mutation: createProfile,
				variables: {
					profile,
				},
			});
			expect(res.errors).toEqual([new GraphQLError("User already exists")]);
		});
	});

	describe("Fetching Profile", () => {
		const getProfile = gql`
			query getProfile($id: ID!) {
				profile(id: $id) {
					firstName
					lastName
					email
				}
			}
		`;

		it("Should fetch the user profile if authenticated and with a valid id", async () => {
			const { query } = setClientWithContext(true);

			const res = await query({
				query: getProfile,
				variables: {
					id,
				},
			});
			expect(res.data.profile.firstName).toEqual("John");
			expect(res.data.profile.lastName).toEqual("Doe");
		});

		it("Should reject query if user is not authenticated", async () => {
			const { query } = setClientWithContext(false);

			const res = await query({
				query: getProfile,
				variables: {
					id,
				},
			});
			expect(res.data.profile).toBeNull();
			expect(res.errors).toEqual([new GraphQLError("You need to login first")]);
		});

		it("Should error out if profile does not exist", async () => {
			const { query } = setClientWithContext(true);
			const res = await query({
				query: getProfile,
				variables: {
					id: "123456",
				},
			});
			expect(res.errors).toEqual([
				new GraphQLError("Profile with id 123456 not found"),
			]);
		});
	});
});
