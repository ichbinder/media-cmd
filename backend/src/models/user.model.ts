import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    username: string;
    password: string;
    tokens: { token: string, expiresIn: Date }[];
    role: 'user' | 'admin';
};

const userSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tokens: [{
        token: { type: String, required: true },
        expiresIn: { type: Date, required: true }
    }],
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: true,
        default: 'user'
    },
});

userSchema.pre<IUser>('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

export default mongoose.model<IUser>('User', userSchema, 'users');
