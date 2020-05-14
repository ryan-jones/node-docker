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
const country_1 = __importDefault(require("../models/country"));
const testSetup_1 = require("../testSetup");
const graphql_1 = require("graphql");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testSetup_1.connectToDb();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testSetup_1.dropTestDb();
    yield testSetup_1.closeDbConnection();
}));
const createCountry = apollo_server_express_1.gql `
	mutation createCountry($country: CountryInput!) {
		insertCountry(country: $country) {
			id
			name
			countryCode
		}
	}
`;
const createCountries = apollo_server_express_1.gql `
	mutation createCountries($countries: [CountryInput]!) {
		insertCountries(countries: $countries) {
			name
			countryCode
		}
	}
`;
const getCountries = apollo_server_express_1.gql `
	query {
		countries {
			id
			name
			countryCode
		}
	}
`;
const getCountry = apollo_server_express_1.gql `
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
        it("should create a unique country", () => __awaiter(void 0, void 0, void 0, function* () {
            const { mutate } = testSetup_1.setClientWithContext(true);
            const res = yield mutate({
                mutation: createCountry,
                variables: {
                    country: {
                        name: "United States of America",
                        countryCode: "USA",
                    },
                },
            });
            const country = yield country_1.default.findOne({ countryCode: "USA" });
            id = res.data.insertCountry.id;
            expect(res.data.insertCountry.name).toEqual("United States of America");
            expect(country).toBeTruthy();
        }));
        it("should create multiple unique countries at one time", () => __awaiter(void 0, void 0, void 0, function* () {
            const { mutate } = testSetup_1.setClientWithContext(true);
            const res = yield mutate({
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
        }));
        it("should filter existing countries when inserting multiple countries at one time", () => __awaiter(void 0, void 0, void 0, function* () {
            const { mutate } = testSetup_1.setClientWithContext(true);
            const res = yield mutate({
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
        }));
        it("should fetch all existing countries", () => __awaiter(void 0, void 0, void 0, function* () {
            const { query } = testSetup_1.setClientWithContext(true);
            const { data } = yield query({
                query: getCountries,
            });
            expect(data.countries).toHaveLength(6);
            expect(data.countries[0].name).toEqual("United States of America");
        }));
        it("should fetch selected valid country", () => __awaiter(void 0, void 0, void 0, function* () {
            const { query } = testSetup_1.setClientWithContext(true);
            const { data } = yield query({
                query: getCountry,
                variables: {
                    countryCode: "USA",
                },
            });
            expect(data.country.name).toEqual("United States of America");
        }));
        it("should reject a request for a country that does not yet exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const { query } = testSetup_1.setClientWithContext(true);
            const res = yield query({
                query: getCountry,
                variables: {
                    countryCode: "ESP",
                },
            });
            expect(res.errors).toEqual([
                new graphql_1.GraphQLError("UserInputError: Country does not exist"),
            ]);
        }));
    });
    describe("when not authenticated", () => {
        it("should prevent unathenticated users from creating country", () => __awaiter(void 0, void 0, void 0, function* () {
            const { mutate } = testSetup_1.setClientWithContext(false);
            const { data, errors } = yield mutate({
                mutation: createCountry,
                variables: {
                    country: {
                        name: "United States of America",
                        countryCode: "USA",
                    },
                },
            });
            expect(data).toBeNull();
            expect(errors).toEqual([new graphql_1.GraphQLError("You need to login first")]);
        }));
    });
});
//# sourceMappingURL=country.spec.js.map