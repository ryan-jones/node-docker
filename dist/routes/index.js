"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profile_1 = require("../controllers/profile");
const router = express_1.default.Router();
router.get('/user/:id', profile_1.getProfile);
router.post('/user', profile_1.createProfile);
exports.default = router;
//# sourceMappingURL=index.js.map