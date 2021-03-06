import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import { typeDefs, resolvers } from "./graphql";
import { config } from "dotenv";
import bodyParser from "body-parser";
import express from "express";
import isAuth from "./middlewares/auth";
import { createTestClient } from "apollo-server-testing";
import { IReq } from "./server";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(isAuth);

export const connectToDb = async () => {
	config();
	await mongoose
		.connect(process.env.MONGO_TEST_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.catch((error) => console.error(error));
};

export const dropTestDb = async () => {
	if (process.env.NODE_ENV === "test" && mongoose.connection.db) {
		await mongoose.connection.db
			.dropDatabase()
			.catch((error) => console.error(error));
	}
};

export const closeDbConnection = async () => {
	await mongoose.connection.close().catch((error) => console.error(error));
};

export const server: any = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }: IReq) => ({ isAuth: false }),
});

server.applyMiddleware({ app });

export const setClientWithContext = (isAuth: boolean) => {
	server.context = () => ({ isAuth });
	return createTestClient(server);
};
