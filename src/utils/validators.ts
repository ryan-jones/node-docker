export function checkReqInvalid(values: any, required: string[]): boolean {
  return required.some((value: string) => values[value] === undefined);
}
