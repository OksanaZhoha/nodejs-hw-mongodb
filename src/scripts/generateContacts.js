import { PATH_DB } from '../constants/contacts.js';
import { createFakeContact } from '../utils/createFakeContact.js';
import fs from 'fs/promises';

const generateContacts = async (number) => {
  try {
    const data = await fs.readFile(PATH_DB, 'utf8');
    const contacts = JSON.parse(data);

    for (let index = 0; index < number; index++) {
      contacts.push(createFakeContact());
    }
    await fs.writeFile(PATH_DB, JSON.stringify(contacts));
    console.log(`Successful operation.Added ${number} contacts.`);
  } catch (err) {
    console.error('Incorect data', err);
  }
};

await generateContacts(10);
