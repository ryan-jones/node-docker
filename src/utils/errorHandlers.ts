import { Response } from 'express';

export function badRequest(res: Response, values: string[]) {
  let message = 'Bad request: ';
  if (values.length === 1) {
    message += `${values[0]} is invalid`;
  } else {
    const lastValue: string = values.pop();
    const fields: string = values.join(', ');
    message += `${fields} & ${lastValue} are invalid`;
  }
  res.status(400).json({ message });
}

export function notFound(res: Response, message = 'not found') {
  res.status(404).json({ message });
}

export function alreadyExists(res: Response, message = 'already exists') {
  res.status(200).json({ message });
}
