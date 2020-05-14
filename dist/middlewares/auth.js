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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function default_1(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.get("Authorization");
        if (!authHeader) {
            req.isAuth = false;
            return next();
        }
        const token = authHeader.split(" ")[1];
        if (!token || token === "") {
            req.isAuth = false;
            return next();
        }
        let decodedToken;
        try {
            decodedToken = yield jsonwebtoken_1.default.verify(token, "somesupersecretkey");
        }
        catch (err) {
            req.isAuth = false;
            return next();
        }
        if (!decodedToken) {
            req.isAuth = false;
            return next();
        }
        req.isAuth = true;
        req.userId = decodedToken.userId;
        next();
    });
}
exports.default = default_1;
//# sourceMappingURL=auth.js.map