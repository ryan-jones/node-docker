import Country from '../models/country';
import { checkReqInvalid, checkReqManyInvalid } from '../utils/validators';
import {
  ForbiddenError,
  ApolloError,
  UserInputError
} from 'apollo-server-express';
import { alreadyExists } from '../utils/errorHandlers';
import { setUpdatedValues, findInadmissable } from '../utils/updateHandlers';

export interface ICountry {
  name: string;
  countryCode: string;
  id?: string;
}
const required = ['name', 'countryCode'];

export async function getCountries(): Promise<ICountry[]> {
  try {
    const countries = Country.find();
    return countries;
  } catch (err) {
    throw new ApolloError(err);
  }
}

export async function createCountry(country: ICountry): Promise<ICountry> {
  checkReqInvalid(country, required);

  try {
    const existingCountry = await Country.findOne({
      countryCode: country.countryCode
    });
    if (existingCountry) {
      throw new ForbiddenError('Country already exists');
    }
    const newCountry = new Country({
      name: country.name,
      countryCode: country.countryCode
    });
    await newCountry.save();
    return newCountry;
  } catch (err) {
    throw new ApolloError(err);
  }
}

export async function createCountries(
  countries: ICountry[]
): Promise<ICountry[]> {
  checkReqManyInvalid(countries, required);

  try {
    const existingCountries: ICountry[] = await Country.find();
    const inadmissable: string[] = findInadmissable(
      countries,
      existingCountries
    );

    if (inadmissable.length > 0) {
      alreadyExists(inadmissable);
    }
    const admissableCountries = countries.map(
      (country: ICountry) =>
        new Country({
          name: country.name,
          countryCode: country.countryCode
        })
    );
    await Country.insertMany(admissableCountries);
    return admissableCountries;
  } catch (err) {
    throw new ApolloError(err);
  }
}

export async function updateCountry(country: ICountry): Promise<ICountry> {
  const updatedValues: any = setUpdatedValues(country, required);
  try {
    const result: ICountry = await Country.findOneAndUpdate(
      { _id: country.id },
      { $set: { ...updatedValues } },
      { new: true }
    );
    return result;
  } catch (err) {
    throw new UserInputError(`Country with id ${country.id} not found`);
  }
}
