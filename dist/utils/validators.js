"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandlers_1 = require("./errorHandlers");
function checkAuth(context) {
    if (!context.isAuth) {
        errorHandlers_1.unauthorized();
    }
    return true;
}
exports.checkAuth = checkAuth;
//# sourceMappingURL=validators.js.map