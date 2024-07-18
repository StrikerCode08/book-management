import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
// Define an interface representing a User document in MongoDB
interface IUser extends Document {
  userName: string;
  password: string;
  name: string;
  borrowedBooks: mongoose.Types.ObjectId[];
  matchPassword(candidatePassword: string): Promise<boolean>;
  generateToken:(id:string)=>string;
  _id:string;
}

// Create a Schema corresponding to the document interface
const UserSchema: Schema = new Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});
// Password hashing middleware
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};
//Method to generate JWT
UserSchema.methods.generateToken = (id: string) => {
    return jwt.sign({ id }, `${process.env.JWT_SECRECT}`, {
        expiresIn: `${process.env.JWT_EXPIRY}`,
    });
};

// Create a User model
const User = mongoose.model<IUser>("User", UserSchema);

export { User, IUser };
