import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  dateCreated: {
    default: Date.now(),
    type: Date
  },
  email: {
    required: true,
    type: String
  },
  firstName: {
    required: true,
    type: String
  },
  lastName: {
    required: true,
    type: String
  }
});

export default mongoose.model('profile', ProfileSchema);
