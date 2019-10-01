import { IRequest } from '../services/profile';
import { unauthorized, badRequest } from './errorHandlers';

export function checkReqInvalid(values: any, required: string[]): void {
  const invalidFields: string[] = required.filter(
    (value: string) => values[value] === undefined
  );
  if (invalidFields.length > 0) {
    badRequest(required.filter((value: string) => values[value] === undefined));
  }
}

export function checkReqManyInvalid(
  documents: any[],
  required: string[]
): void {
  const invalidDocuments: any[] = documents.filter((document: any) =>
    required.some((field: string) => document[field] === undefined)
  );
  if (invalidDocuments.length > 0) {
    badRequest(invalidDocuments.map((document: any) => document[required[0]]));
  }
}

export function checkAuth(context: any): boolean {
  if (!context.isAuth) {
    unauthorized();
  }
  return true;
}
