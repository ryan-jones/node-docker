import { unauthorized } from "./errorHandlers";
import { IAuth } from "../interfaces";

export function checkAuth(context: IAuth): boolean {
	if (!context.isAuth) {
		unauthorized();
	}
	return true;
}
