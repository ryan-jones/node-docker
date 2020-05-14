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
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = __importDefault(require("mongoose"));
const graphql_1 = require("./graphql");
const dotenv_1 = require("dotenv");
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./middlewares/auth"));
const apollo_server_testing_1 = require("apollo-server-testing");
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
app.use(auth_1.default);
exports.connectToDb = () => __awaiter(void 0, void 0, void 0, function* () {
    dotenv_1.config();
    console.log("OUR MONGO_URI", process.env.MONGO_TEST_URI);
    yield mongoose_1.default
        .connect(process.env.MONGO_TEST_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .catch((error) => console.error(error));
});
exports.dropTestDb = () => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.NODE_ENV === "test" && mongoose_1.default.connection.db) {
        yield mongoose_1.default.connection.db
            .dropDatabase()
            .catch((error) => console.error(error));
    }
});
exports.closeDbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close().catch((error) => console.error(error));
});
exports.server = new apollo_server_express_1.ApolloServer({
    typeDefs: graphql_1.typeDefs,
    resolvers: graphql_1.resolvers,
    context: ({ req }) => ({ isAuth: false }),
});
exports.server.applyMiddleware({ app });
exports.setClientWithContext = (isAuth) => {
    exports.server.context = () => ({ isAuth });
    return apollo_server_testing_1.createTestClient(exports.server);
};
//# sourceMappingURL=testSetup.js.map