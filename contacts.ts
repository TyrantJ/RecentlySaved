import * as SecureStore from 'expo-secure-store';

export type ContactItem = {
  name: string;
  number: string;
  time: string;
  location: string;
  contacted: boolean; // This field tracks contact status
};

const CONTACTS_KEY = 'contacts';

/**
 * Fetch contacts from SecureStore.
 */
export async function getContacts(): Promise<ContactItem[]> {
  const stored = await SecureStore.getItemAsync(CONTACTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Save updated contact list to SecureStore.
 */
export async function saveContacts(contacts: ContactItem[]) {
  await SecureStore.setItemAsync(CONTACTS_KEY, JSON.stringify(contacts));
}

/**
 * Mark a contact as contacted by name and number.
 */
export async function markContacted(name: string, number: string) {
  const contacts = await getContacts();
  const updated = contacts.map(c =>
    c.name === name && c.number === number
      ? { ...c, contacted: true }
      : c
  );
  await saveContacts(updated);
}

/**
 * Add a new contact (defaults to not contacted).
 */
export async function addContact(contact: Omit<ContactItem, 'contacted'>) {
  const contacts = await getContacts();
  contacts.push({ ...contact, contacted: false });
  await saveContacts(contacts);
}
