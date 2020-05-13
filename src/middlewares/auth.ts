import jwt from "jsonwebtoken";
import { NextFunction, Response, Request } from "express";
import { IAuth } from "../interfaces";

export default async function (req: IAuth, res: Response, next: NextFunction) {
	const authHeader: string = req.get("Authorization");
	if (!authHeader) {
		req.isAuth = false;
		return next();
	}
	const token: string = authHeader.split(" ")[1];
	if (!token || token === "") {
		req.isAuth = false;
		return next();
	}
	let decodedToken;
	try {
		decodedToken = await jwt.verify(token, "somesupersecretkey");
	} catch (err) {
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
}
