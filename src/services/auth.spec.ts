import { gql } from "apollo-server-express";
import {
	setClientWithContext,
	connectToDb,
	dropTestDb,
	closeDbConnection,
} from "../testSetup";
import { GraphQLError } from "graphql";

beforeAll(async () => {
	await connectToDb();
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
	await mutate({
		mutation: createProfile,
		variables: {
			profile: {
				firstName: "John",
				lastName: "Doe",
				email: "johndoe@example.com",
				password: "mypassword",
			},
		},
	});
});

afterAll(async () => {
	await dropTestDb();
	await closeDbConnection();
});

describe("User login", () => {
	const loginUser = gql`
		query loginUser($email: String!, $password: String!) {
			login(email: $email, password: $password) {
				token
				profileId
			}
		}
	`;

	it("should log existing user in with valid credential", async () => {
		const { query } = setClientWithContext(false);

		const res = await query({
			query: loginUser,
			variables: {
				email: "johndoe@example.com",
				password: "mypassword",
			},
		});
		expect(res.data.login.token).toBeTruthy();
		expect(res.data.login.profileId).toBeTruthy();
	});

	it("should reject user with invalid password", async () => {
		const { query } = setClientWithContext(false);

		const res = await query({
			query: loginUser,
			variables: {
				email: "johndoe@example.com",
				password: "mypasswordincorrect",
			},
		});
		expect(res.data).toBeNull();
		expect(res.errors).toEqual([
			new GraphQLError("UserInputError: Password is incorrect!"),
		]);
	});

	it("should reject user with invalid email", async () => {
		const { query } = setClientWithContext(false);

		const res = await query({
			query: loginUser,
			variables: {
				email: "janedoe@example.com",
				password: "mypassword",
			},
		});
		expect(res.data).toBeNull();
		expect(res.errors).toEqual([
			new GraphQLError(
				"UserInputError: no user exists for janedoe@example.com"
			),
		]);
	});
});
