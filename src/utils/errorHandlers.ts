import { UserInputError } from 'apollo-server-core';

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
