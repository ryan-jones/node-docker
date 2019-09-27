import jwt from 'jsonwebtoken';

export default async function(req, res, next) {
  const authHeader: string = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token: string = authHeader.split(' ')[1];
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = await jwt.verify(token, 'somesupersecretkey');
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
}
