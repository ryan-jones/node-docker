"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const apollo_server_express_1 = require("apollo-server-express");
const graphql_1 = require("./graphql");
const auth_1 = __importDefault(require("./middlewares/auth"));
const dotenv_1 = require("dotenv");
const app = express_1.default();
dotenv_1.config();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
app.use(morgan_1.default("dev"));
app.use(auth_1.default);
// mongoose
// 	.connect(process.env.MONGO_DOCKER_URI, { useNewUrlParser: true })
// 	.then(() => console.log("MongoDb connected"))
// 	.catch((err: any) => console.error(err));
mongoose_1.default
    .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDb connected"))
    .catch((err) => console.error(err));
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: graphql_1.typeDefs,
    resolvers: graphql_1.resolvers,
    context: ({ req }) => ({ isAuth: req.isAuth }),
});
server.applyMiddleware({ app });
app.get("*", (req, res, next) => {
    const err = new Error("Page Not Found");
    err.statusCode = 404;
    next(err);
});
app.use((err, req, res) => {
    console.error(err.message);
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    res.status(err.statusCode).send(`${err.statusCode} - ${err.message}`);
});
app.listen(3000, () => {
    console.log("App is running on port 3000");
});
exports.default = server;
//# sourceMappingURL=server.js.map