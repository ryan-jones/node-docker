export async function getProfile(req, res, next) {
  res.send('Hello world');
}

export async function createProfile(req, res, next) {
  console.log('profile created');
}
