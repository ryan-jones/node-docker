"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_core_1 = require("apollo-server-core");
function badRequest(values) {
    let message = "Bad request: ";
    if (values.length === 1) {
        message += `${values[0]} is invalid`;
    }
    else {
        const lastValue = values.pop();
        const fields = values.join(", ");
        message += `${fields} & ${lastValue} are invalid`;
    }
    throw new apollo_server_core_1.UserInputError(message);
}
exports.badRequest = badRequest;
function unauthorized() {
    throw new apollo_server_core_1.ApolloError("You need to login first", "401");
}
exports.unauthorized = unauthorized;
function alreadyExists(values) {
    let message = "";
    if (values.length === 1) {
        message = `${values[0]} already exists`;
    }
    else {
        const lastValue = values.pop();
        const fields = values.join(", ");
        message = `${fields} & ${lastValue} already exist`;
    }
    throw new apollo_server_core_1.ApolloError(message);
}
exports.alreadyExists = alreadyExists;
//# sourceMappingURL=errorHandlers.js.map