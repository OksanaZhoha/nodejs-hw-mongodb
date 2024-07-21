import { model, Schema } from 'mongoose';
import { emailReg } from '../../constans/auth.js';
import { mongooseSaveError, setUpdateSet } from './hooks.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailReg,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.post('save', mongooseSaveError);

userSchema.pre('findOneAndUpdate', setUpdateSet);

userSchema.post('findOneAndUpdate', mongooseSaveError);

export const User = model('users', userSchema);
