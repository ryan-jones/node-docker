import { ICountry } from '../services/country';

export const setUpdatedValues = (params, required): any =>
  required.reduce((values: any, value: string) => {
    return params[value] !== undefined
      ? { ...values, [value]: params[value] }
      : values;
  }, {});

export const findInadmissable = (
  countries: ICountry[],
  existing: ICountry[]
): string[] =>
  countries.reduce((exists: string[], country: ICountry) => {
    const doesExist: boolean = existing.some(
      (ec: ICountry) => ec.countryCode === country.countryCode
    );
    return doesExist ? exists.concat(country.name) : exists;
  }, []);
