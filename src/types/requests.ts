import { Request } from 'express';

export interface IAuth extends Request {
  isAuth: boolean;
  userId: string;
}

export type IReq = {
  req: IAuth;
};
