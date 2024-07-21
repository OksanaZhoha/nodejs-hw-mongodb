import { model, Schema } from 'mongoose';
import { mongooseSaveError, setUpdateSet } from './hooks.js';

const sessionSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  { versionKey: false },
);

sessionSchema.post('save', mongooseSaveError);

sessionSchema.pre('findOneAndUpdate', setUpdateSet);

sessionSchema.post('findOneAndUpdate', mongooseSaveError);

export const Session = model('session', sessionSchema);
