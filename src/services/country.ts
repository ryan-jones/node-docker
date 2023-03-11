import Country from '../models/country';
import {
  ForbiddenError,
  ApolloError,
  UserInputError,
} from 'apollo-server-express';
import { ICountry } from 'src/types/country';

export async function getCountries(): Promise<ICountry[]> {
  try {
    const countries: ICountry[] = await Country.find();
    return countries;
  } catch (err) {
    throw new ApolloError(err);
  }
}

export async function getCountry(countryCode: string): Promise<ICountry> {
  try {
    const country: ICountry = await Country.findOne({ countryCode });
    if (!country) {
      throw new UserInputError('Country does not exist');
    }
    return country;
  } catch (err) {
    throw new ApolloError(err);
  }
}

export async function createCountry(country: ICountry): Promise<ICountry> {
  try {
    const existingCountry: ICountry = await Country.findOne({
      countryCode: country.countryCode,
    });
    if (existingCountry) {
      throw new ForbiddenError('Country already exists');
    }
    const newCountry = new Country({
      name: country.name,
      countryCode: country.countryCode,
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
  try {
    const existingCountries: ICountry[] = await Country.find();

    const admissableCountries = countries.reduce(
      (countries: ICountry[], country: ICountry) => {
        return existingCountries.find(
          (extCountry) => extCountry.name === country.name
        )
          ? countries
          : countries.concat(
              new Country({
                name: country.name,
                countryCode: country.countryCode,
              })
            );
      },
      []
    );
    const returnedCountries = await Country.insertMany(admissableCountries);
    return returnedCountries;
  } catch (err) {
    throw new ApolloError(err);
  }
}

export async function updateCountry(country: ICountry): Promise<ICountry> {
  try {
    const result: ICountry = await Country.findOneAndUpdate(
      { _id: country.id },
      { $set: { ...country } },
      { new: true }
    );
    return result;
  } catch (err) {
    throw new UserInputError(`Country with id ${country.id} not found`);
  }
}
