"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const app = express_1.default();
app.use(express_1.default.static('public'));
app.use(morgan_1.default('dev'));
app.use(body_parser_1.default.json());
// mongoose
//   .connect('mongodb://mongo:27017/docker-node', { useNewUrlParser: true })
//   .then(() => console.log('MongoDb connected'))
//   .catch((err: any) => console.error(err));
mongoose_1.default
    .connect('localhost://mongo:27017/docker-node', { useNewUrlParser: true })
    .then(() => console.log('MongoDb connected'))
    .catch((err) => console.error(err));
app.use('/api/v1', routes_1.default);
app.get('*', (req, res, next) => {
    const err = new Error('Page Not Found');
    err.statusCode = 404;
    next(err);
});
app.use((err, req, res, next) => {
    console.error(err.message);
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    res.status(err.statusCode).send(`${err.statusCode} - ${err.message}`);
});
app.listen(3000, () => {
    // tslint:disable-next-line:no-console
    console.log('App is running on port 3000');
});
//# sourceMappingURL=server.js.map