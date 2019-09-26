import Profile from '../models/profile';
import { alreadyExists, badRequest, notFound } from '../utils/errorHandlers';
import { checkReqInvalid } from '../utils/validators';
import { NextFunction as Next, Request, Response } from 'express';

export interface IProfile {
  firstName: string;
  lastName: string;
  email: string;
}

export async function getProfiles(req: Request, res: Response, next: Next) {
  try {
    const profiles: IProfile[] = await Profile.find();
    profiles.length > 0
      ? res.json({ profiles })
      : notFound(res, 'no profile exists');
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req: Request, res: Response, next: Next) {
  const id: string = req.params.id;
  try {
    const profile: IProfile = await Profile.findById(id);
    profile
      ? res.json({ profile })
      : notFound(res, `Profile with id ${id} not found`);
  } catch (err) {
    next(err);
  }
}

export async function createProfile(req: Request, res: Response, next: Next) {
  const required = ['firstName', 'lastName', 'email'];

  if (checkReqInvalid(req.body, required)) {
    badRequest(
      res,
      required.filter((value: string) => req.body[value] === undefined)
    );
  }

  const newProfile = new Profile({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });
  try {
    await newProfile.save();
    res.send({ message: 'profile successfully added!' });
  } catch (err) {
    if (err.code === 11000) {
      alreadyExists(res, 'A user with this email already exists');
    }
    next(err);
  }
}
