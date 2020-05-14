"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const Schema = mongoose_1.default.Schema;
const ProfileSchema = new Schema({
    dateCreated: {
        default: Date.now(),
        type: Date,
    },
    email: {
        required: true,
        type: String,
        unique: true,
        validate: [isEmail_1.default, "please enter a valid email"],
    },
    firstName: {
        required: true,
        type: String,
    },
    lastName: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
        minLength: 6,
    },
});
exports.default = mongoose_1.default.model("profile", ProfileSchema);
//# sourceMappingURL=profile.js.map