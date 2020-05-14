"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profile_1 = require("../services/profile");
const auth_1 = require("../services/auth");
const validators_1 = require("../utils/validators");
const country_1 = require("../services/country");
exports.resolvers = {
    Query: {
        profiles: (_, args, context) => validators_1.checkAuth(context) && profile_1.getProfiles(),
        profile: (_, args, context) => validators_1.checkAuth(context) && profile_1.getProfile(args.id),
        login: (_, { email, password }) => auth_1.login(email, password),
        countries: (_, args) => country_1.getCountries(),
        country: (_, args) => country_1.getCountry(args.countryCode),
    },
    Mutation: {
        insertProfile: (_, args) => profile_1.createProfile(args.profile),
        updateProfile: (_, args, context) => validators_1.checkAuth(context) && profile_1.updateProfile(args),
        deleteProfile: (_, args, context) => validators_1.checkAuth(context) && profile_1.deleteProfile(args.id),
        insertCountry: (_, args, context) => validators_1.checkAuth(context) && country_1.createCountry(args.country),
        insertCountries: (_, args, context) => validators_1.checkAuth(context) && country_1.createCountries(args.countries),
        updateCountry: (_, args, context) => validators_1.checkAuth(context) && country_1.updateCountry(args.country),
    },
};
//# sourceMappingURL=resolvers.js.map