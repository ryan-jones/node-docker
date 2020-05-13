import { gql } from "apollo-server-express";
import Profile from "../models/profile";
import {
	server,
	connectToDb,
	dropTestDb,
	closeDbConnection,
} from "../__testSetup__/setup";
import { GraphQLError } from "graphql";
import { createTestClient } from "apollo-server-testing";

beforeAll(async () => {
	await connectToDb();
});

afterAll(async () => {
	await dropTestDb();
	await closeDbConnection();
});

let id;

describe("Testing Profile Queries and Mutations", () => {
	describe("Create Profile", () => {
		const { mutate } = createTestClient(server);
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
			const { errors } = await mutate({
				mutation: createProfile,
				variables: {
					profile,
				},
			});
			expect(errors).toEqual([new GraphQLError("User already exists")]);
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
			server.context = () => ({ isAuth: true });
			const { query } = createTestClient(server);

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
			server.context = () => ({ isAuth: false });
			const { query } = createTestClient(server);
			const res = await query({
				query: getProfile,
				variables: {
					id,
				},
			});
			expect(res.data.profile).toBeNull();
			expect(res.errors).toEqual([new GraphQLError("You need to login first")]);
		});
	});
});
