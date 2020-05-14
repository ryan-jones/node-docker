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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function login(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield profile_1.default.findOne({ email });
            if (!user) {
                throw new apollo_server_express_1.UserInputError(`no user exists for ${email}`);
            }
            const isEqual = yield bcryptjs_1.default.compare(password, user.password);
            if (!isEqual) {
                throw new apollo_server_express_1.UserInputError("Password is incorrect!");
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, "somesupersecretkey", {
                expiresIn: "1h",
            });
            return { profileId: user._id, token, tokenExpiration: 1 };
        }
        catch (err) {
            throw new apollo_server_express_1.ApolloError(err);
        }
    });
}
exports.login = login;
//# sourceMappingURL=auth.js.map