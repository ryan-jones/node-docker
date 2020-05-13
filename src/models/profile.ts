import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail";
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
	dateCreated: {
		default: Date.now(),
		type: Date,
	},
	email: {
		required: true,
		type: String,
		unique: true,
		validate: [isEmail, "please enter a valid email"],
	},
	firstName: {
		required: true,
		type: String,
	},
	lastName: {
		required: true,
		type: String,
	},
	password: {
		required: true,
		type: String,
		minLength: 6,
	},
});

export default mongoose.model("profile", ProfileSchema);
