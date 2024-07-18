import mongoose, { Schema, Document } from 'mongoose';

// Define an interface representing a Book document in MongoDB
interface IBook extends Document {
    title: string;
    author: string;
    isbn: string;
    available: boolean;
    _id:mongoose.Types.ObjectId;
}

// Create a Schema corresponding to the document interface
const BookSchema: Schema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    available: { type: Boolean, default: true }
});

// Create a Book model
const Book = mongoose.model<IBook>('Book', BookSchema);

export { Book, IBook };
