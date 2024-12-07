import { model, Schema } from 'mongoose';
import { contactType } from '../../constans/contacts.js';

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
      enum: contactType,
      required: true,
      default: 'personal',
    },
  },
  { versionKey: false, timestamps: true },
);
export const ContactsCollection = model('contacts', contactSchema);
