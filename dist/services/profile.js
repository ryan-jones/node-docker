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
const profile_1 = __importDefault(require("../models/profile"));
const apollo_server_express_1 = require("apollo-server-express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function getProfiles() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield profile_1.default.find();
            return result;
        }
        catch (err) {
            throw new apollo_server_express_1.ApolloError("There was a server error when querying for profiles");
        }
    });
}
exports.getProfiles = getProfiles;
function getProfile(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const profile = yield profile_1.default.findById(id);
            return profile;
        }
        catch (err) {
            throw new apollo_server_express_1.UserInputError(`Profile with id ${id} not found`);
        }
    });
}
exports.getProfile = getProfile;
function createProfile(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password, firstName, lastName } = params;
        try {
            const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
            const newProfile = new profile_1.default({
                email,
                firstName,
                lastName,
                password: hashedPassword,
            });
            const result = yield newProfile.save();
            return result;
        }
        catch (err) {
            throw new apollo_server_express_1.ForbiddenError("User already exists");
        }
    });
}
exports.createProfile = createProfile;
function updateProfile(params) {
    return __awaiter(this, void 0, void 0, function* () {
        if (params.password) {
            params.password = yield bcryptjs_1.default.hash(params.password, 12);
        }
        try {
            const result = yield profile_1.default.findOneAndUpdate({ _id: params.id }, { $set: Object.assign({}, params) }, { new: true });
            return result;
        }
        catch (err) {
            throw new apollo_server_express_1.UserInputError(`Profile with id ${params.id} not found`);
        }
    });
}
exports.updateProfile = updateProfile;
function deleteProfile(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield profile_1.default.findOneAndRemove({ _id: id });
            return result;
        }
        catch (err) {
            throw new apollo_server_express_1.UserInputError(`Profile with id ${id} not found`);
        }
    });
}
exports.deleteProfile = deleteProfile;
//# sourceMappingURL=profile.js.map