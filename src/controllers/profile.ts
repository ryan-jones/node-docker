import Profile from '../models/profile';

function checkIsInvalid(values: any[], next) {
  console.log(
    'values',
    Object.keys(values).some((key: any) => values[key] === undefined)
  );
  if (Object.keys(values).some((key: any) => values[key] === undefined)) {
    badRequest(next);
  }
}

function badRequest(next) {
  const err: any = new Error(
    'Bad request. Profile is missing a required value'
  );
  err.statusCode = 400;
  return next(err);
}

export async function getProfiles(req, res, next) {
  try {
    const profiles = await Profile.find();
    res.json({ profiles });
  } catch (err) {
    res.status(404).json({ message: 'no profile exists' });
  }
}

export async function getProfile(req, res, next) {
  const id = req.params.id;
  try {
    const profile = await Profile.findById(id);
    res.json({ profile });
  } catch (err) {
    next(err);
  }
}

export async function createProfile(req, res, next) {
  checkIsInvalid(req.body, next);
  console.log('BODYYYYYYYY', req.body);
  const { email, firstName, lastName } = req.body;
  console.log('email', email);
  console.log('firstName', firstName);
  console.log('lastName', lastName);
  const newProfile = new Profile({
    email,
    firstName,
    lastName
  });
  try {
    await newProfile.save();
    res.send({ message: 'profile successfully added!' });
  } catch (err) {
    console.error(err);
    next(err);
  }
}
