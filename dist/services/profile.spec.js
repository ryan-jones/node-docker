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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const profile_1 = __importDefault(require("../models/profile"));
const testSetup_1 = require("../testSetup");
const graphql_1 = require("graphql");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testSetup_1.connectToDb();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testSetup_1.dropTestDb();
    yield testSetup_1.closeDbConnection();
}));
let id = "";
describe("Testing Profile Queries and Mutations", () => {
    describe("Create Profile", () => {
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
        const profile = {
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@example.com",
            password: "mypassword",
        };
        it("should successfully create a new profile with valid credentials", () => __awaiter(void 0, void 0, void 0, function* () {
            const { data } = yield mutate({
                mutation: createProfile,
                variables: {
                    profile,
                },
            });
            const user = yield profile_1.default.findOne({ email: "johndoe@example.com" });
            id = data.insertProfile.id;
            expect(data.insertProfile.firstName).toEqual("John");
            expect(user.firstName).toBeTruthy;
            expect(user.firstName).toEqual("John");
        }));
        it("should not create two profiles with the same email", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield mutate({
                mutation: createProfile,
                variables: {
                    profile,
                },
            });
            expect(res.errors).toEqual([new graphql_1.GraphQLError("User already exists")]);
        }));
    });
    describe("Fetching Profile", () => {
        const getProfile = apollo_server_express_1.gql `
			query getProfile($id: ID!) {
				profile(id: $id) {
					firstName
					lastName
					email
				}
			}
		`;
        it("Should fetch the user profile if authenticated and with a valid id", () => __awaiter(void 0, void 0, void 0, function* () {
            const { query } = testSetup_1.setClientWithContext(true);
            const res = yield query({
                query: getProfile,
                variables: {
                    id,
                },
            });
            expect(res.data.profile.firstName).toEqual("John");
            expect(res.data.profile.lastName).toEqual("Doe");
        }));
        it("Should reject query if user is not authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
            const { query } = testSetup_1.setClientWithContext(false);
            const res = yield query({
                query: getProfile,
                variables: {
                    id,
                },
            });
            expect(res.data.profile).toBeNull();
            expect(res.errors).toEqual([new graphql_1.GraphQLError("You need to login first")]);
        }));
        it("Should error out if profile does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const { query } = testSetup_1.setClientWithContext(true);
            const res = yield query({
                query: getProfile,
                variables: {
                    id: "123456",
                },
            });
            expect(res.errors).toEqual([
                new graphql_1.GraphQLError("Profile with id 123456 not found"),
            ]);
        }));
    });
});
//# sourceMappingURL=profile.spec.js.map