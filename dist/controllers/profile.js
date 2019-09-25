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
function checkIsInvalid(values, next) {
    console.log('values', values);
    if (values.some((value) => value === undefined)) {
        badRequest(next);
    }
}
function badRequest(next) {
    const err = new Error('Bad request. Profile is missing a required value');
    err.statusCode = 400;
    return next(err);
}
function getProfile(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const profile = yield profile_1.default.find();
            res.json({ profile });
        }
        catch (err) {
            res.status(404).json({ message: 'no profile exists' });
        }
    });
}
exports.getProfile = getProfile;
function createProfile(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        checkIsInvalid(Object.keys(req.body), next);
        console.log('BODYYYYYYYY', req.body);
        const { email, firstName, lastName } = req.body;
        console.log('email', email);
        console.log('firstName', firstName);
        console.log('lastName', lastName);
        const newProfile = new profile_1.default({
            email,
            firstName,
            lastName
        });
        try {
            yield newProfile.save();
            res.send({ message: 'profile successfully added!' });
        }
        catch (err) {
            console.error(err);
            next(err);
        }
    });
}
exports.createProfile = createProfile;
//# sourceMappingURL=profile.js.map