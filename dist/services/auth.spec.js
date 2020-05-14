"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const testSetup_1 = require("../testSetup");
const graphql_1 = require("graphql");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testSetup_1.connectToDb();
    const { mutate } = testSetup_1.setClientWithContext(true);
    const createProfile = apollo_server_express_1.gql `
		mutation insertProfile($profile: ProfileInput!) {
			insertProfile(profile: $profile) {
				firstName
				lastName
				id
			}
		}
	`;
    yield mutate({
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
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testSetup_1.dropTestDb();
    yield testSetup_1.closeDbConnection();
}));
describe("User login", () => {
    const loginUser = apollo_server_express_1.gql `
		query loginUser($email: String!, $password: String!) {
			login(email: $email, password: $password) {
				token
				profileId
			}
		}
	`;
    it("should log existing user in with valid credential", () => __awaiter(void 0, void 0, void 0, function* () {
        const { query } = testSetup_1.setClientWithContext(false);
        const res = yield query({
            query: loginUser,
            variables: {
                email: "johndoe@example.com",
                password: "mypassword",
            },
        });
        expect(res.data.login.token).toBeTruthy();
        expect(res.data.login.profileId).toBeTruthy();
    }));
    it("should reject user with invalid password", () => __awaiter(void 0, void 0, void 0, function* () {
        const { query } = testSetup_1.setClientWithContext(false);
        const res = yield query({
            query: loginUser,
            variables: {
                email: "johndoe@example.com",
                password: "mypasswordincorrect",
            },
        });
        expect(res.data).toBeNull();
        expect(res.errors).toEqual([
            new graphql_1.GraphQLError("UserInputError: Password is incorrect!"),
        ]);
    }));
    it("should reject user with invalid email", () => __awaiter(void 0, void 0, void 0, function* () {
        const { query } = testSetup_1.setClientWithContext(false);
        const res = yield query({
            query: loginUser,
            variables: {
                email: "janedoe@example.com",
                password: "mypassword",
            },
        });
        expect(res.data).toBeNull();
        expect(res.errors).toEqual([
            new graphql_1.GraphQLError("UserInputError: no user exists for janedoe@example.com"),
        ]);
    }));
});
//# sourceMappingURL=auth.spec.js.map