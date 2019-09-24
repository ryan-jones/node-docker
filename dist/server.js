"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const app = express_1.default();
app.use(express_1.default.static("public"));
app.use(morgan_1.default("dev"));
app.use(body_parser_1.default.json());
app.get("/", (req, res) => res.send("hello world"));
app.listen(3000, () => {
    // tslint:disable-next-line:no-console
    console.log("App is running on port 3000");
});
//# sourceMappingURL=server.js.map