import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const CountrySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  countryCode: {
    type: String,
    required: true
  }
});

export default mongoose.model('country', CountrySchema);
