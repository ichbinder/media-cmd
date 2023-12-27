import mongoose, { Schema, Document } from 'mongoose';

export interface IUsenet extends Document {
	name: string;
	year: number;
	nzbContent: string;
}

const usenetSchema: Schema = new Schema({
	name: { type: String, required: true },
	year: { type: Number, required: true },
	nzbContent: { type: String, required: true }
})

export default mongoose.model<IUsenet>('Usenet', usenetSchema, 'movies');
