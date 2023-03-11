import { IAuth } from 'src/types/requests';
import { unauthorized } from './errorHandlers';

export function checkAuth(context: IAuth): boolean {
  if (!context.isAuth) {
    unauthorized();
  }
  return true;
}
