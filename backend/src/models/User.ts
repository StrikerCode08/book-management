import mongoose, { Schema, Document } from 'mongoose';

// Define an interface representing a User document in MongoDB
interface IUser extends Document {
    userName: string;
    password: string;
    borrowedBooks: mongoose.Types.ObjectId[];
}

// Create a Schema corresponding to the document interface
const UserSchema: Schema = new Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true, unique: true },
    borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
});

// Create a User model
const User = mongoose.model<IUser>('User', UserSchema);

export { User, IUser };
