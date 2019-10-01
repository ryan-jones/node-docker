import { UserInputError, ApolloError } from 'apollo-server-core';

export function badRequest(values: string[]) {
  let message = 'Bad request: ';
  if (values.length === 1) {
    message += `${values[0]} is invalid`;
  } else {
    const lastValue: string = values.pop();
    const fields: string = values.join(', ');
    message += `${fields} & ${lastValue} are invalid`;
  }
  throw new UserInputError(message);
}

export function unauthorized() {
  throw new ApolloError('You need to login first', '401');
}

export function alreadyExists(values: string[]) {
  let message = '';
  if (values.length === 1) {
    message = `${values[0]} already exists`;
  } else {
    const lastValue: string = values.pop();
    const fields: string = values.join(', ');
    message = `${fields} & ${lastValue} already exist`;
  }
  throw new ApolloError(message);
}
