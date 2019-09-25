import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import routes from './routes';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(morgan('dev'));

mongoose
  .connect('mongodb://mongo:27017/docker-node', { useNewUrlParser: true })
  .then(() => console.log('MongoDb connected'))
  .catch((err: any) => console.error(err));

app.use('/api/v1', routes);

app.get('*', (req, res, next) => {
  const err: any = new Error('Page Not Found');
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.error(err.message);
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  res.status(err.statusCode).send(`${err.statusCode} - ${err.message}`);
});

app.listen(3000, () => {
  // tslint:disable-next-line:no-console
  console.log('App is running on port 3000');
});
