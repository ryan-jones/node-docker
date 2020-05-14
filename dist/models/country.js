"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.CountrySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    countryCode: {
        type: String,
        required: true,
        unique: true,
    },
});
exports.default = mongoose_1.default.model("country", exports.CountrySchema);
//# sourceMappingURL=country.js.map