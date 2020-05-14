import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./graphql";
import isAuth from "./middlewares/auth";
import { IAuth } from "./interfaces";
import { config } from "dotenv";

const app = express();
config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(morgan("dev"));

app.use(isAuth);

mongoose
	.connect(process.env.MONGO_DOCKER_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDb connected"))
	.catch((err: any) => console.error(err));

export type IReq = {
	req: IAuth;
};
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }: IReq) => ({ isAuth: req.isAuth }),
});

server.applyMiddleware({ app });

app.get("*", (req: Request, res: Response, next: NextFunction) => {
	const err: any = new Error("Page Not Found");
	err.statusCode = 404;
	next(err);
});

app.use((err: any, req: Request, res: Response) => {
	console.error(err.message);
	if (!err.statusCode) {
		err.statusCode = 500;
	}
	res.status(err.statusCode).send(`${err.statusCode} - ${err.message}`);
});

app.listen(3000, () => {
	console.log("App is running on port 3000");
});

export default server;
