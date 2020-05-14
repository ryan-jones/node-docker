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
const country_1 = __importDefault(require("../models/country"));
const apollo_server_express_1 = require("apollo-server-express");
function getCountries() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const countries = yield country_1.default.find();
            return countries;
        }
        catch (err) {
            throw new apollo_server_express_1.ApolloError(err);
        }
    });
}
exports.getCountries = getCountries;
function getCountry(countryCode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const country = yield country_1.default.findOne({ countryCode });
            if (!country) {
                throw new apollo_server_express_1.UserInputError("Country does not exist");
            }
            return country;
        }
        catch (err) {
            throw new apollo_server_express_1.ApolloError(err);
        }
    });
}
exports.getCountry = getCountry;
function createCountry(country) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existingCountry = yield country_1.default.findOne({
                countryCode: country.countryCode,
            });
            if (existingCountry) {
                throw new apollo_server_express_1.ForbiddenError("Country already exists");
            }
            const newCountry = new country_1.default({
                name: country.name,
                countryCode: country.countryCode,
            });
            yield newCountry.save();
            return newCountry;
        }
        catch (err) {
            throw new apollo_server_express_1.ApolloError(err);
        }
    });
}
exports.createCountry = createCountry;
function createCountries(countries) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existingCountries = yield country_1.default.find();
            const admissableCountries = countries.reduce((countries, country) => {
                return existingCountries.find((extCountry) => extCountry.name === country.name)
                    ? countries
                    : countries.concat(new country_1.default({
                        name: country.name,
                        countryCode: country.countryCode,
                    }));
            }, []);
            const returnedCountries = yield country_1.default.insertMany(admissableCountries);
            return returnedCountries;
        }
        catch (err) {
            throw new apollo_server_express_1.ApolloError(err);
        }
    });
}
exports.createCountries = createCountries;
function updateCountry(country) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield country_1.default.findOneAndUpdate({ _id: country.id }, { $set: Object.assign({}, country) }, { new: true });
            return result;
        }
        catch (err) {
            throw new apollo_server_express_1.UserInputError(`Country with id ${country.id} not found`);
        }
    });
}
exports.updateCountry = updateCountry;
//# sourceMappingURL=country.js.map