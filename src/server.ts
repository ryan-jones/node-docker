import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import routes from './routes';

const app = express();

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect('mongodb://mongo:27017/docker-node', { useNewUrlParser: true })
  .then(() => console.log('MongoDb connected'))
  .catch((err: any) => console.error(err));

app.use('/api/v1', routes);

app.listen(3000, () => {
  // tslint:disable-next-line:no-console
  console.log('App is running on port 3000');
});
