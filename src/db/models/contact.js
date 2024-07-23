import { model, Schema } from 'mongoose';
import { typeList } from '../../constans/contacts.js';
import { mongooseSaveError, setUpdateSet } from './hooks.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: typeList,
      default: 'personal',
    },
    userId: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true },
);

contactSchema.post('save', mongooseSaveError);

contactSchema.pre('findOneAndUpdate', setUpdateSet);

contactSchema.post('findOneAndUpdate', mongooseSaveError);

export const ContactsCollection = model('contacts', contactSchema);
