import { openDB, IDBPDatabase, DBSchema } from "idb";
import { Contact, Letter } from "@/types";
import { generateId } from "@/utils/id";
import { mockContacts, mockLetters } from "@/utils/mockData";

interface LetterTrackerDB extends DBSchema {
  contacts: {
    key: string;
    value: Contact;
    indexes: {
      name: string;
      city: string;
      country: string;
      created_at: string;
    };
  };
  letters: {
    key: string;
    value: Letter;
    indexes: {
      contact_id: string;
      type: string;
      direction: string;
      sent_date: string;
      received_date: string;
      is_replied: string;
      contact_city: string;
      contact_country: string;
      created_at: string;
    };
  };
  meta: {
    key: string;
    value: { key: string; value: boolean };
  };
}

const DB_NAME = "letter_tracker";
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<LetterTrackerDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<LetterTrackerDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<LetterTrackerDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("contacts")) {
        const contactStore = db.createObjectStore("contacts", {
          keyPath: "id",
        });
        contactStore.createIndex("name", "name");
        contactStore.createIndex("city", "city");
        contactStore.createIndex("country", "country");
        contactStore.createIndex("created_at", "created_at");
      }

      if (!db.objectStoreNames.contains("letters")) {
        const letterStore = db.createObjectStore("letters", {
          keyPath: "id",
        });
        letterStore.createIndex("contact_id", "contact_id");
        letterStore.createIndex("type", "type");
        letterStore.createIndex("direction", "direction");
        letterStore.createIndex("sent_date", "sent_date");
        letterStore.createIndex("received_date", "received_date");
        letterStore.createIndex("is_replied", "is_replied");
        letterStore.createIndex("contact_city", "contact_city");
        letterStore.createIndex("contact_country", "contact_country");
        letterStore.createIndex("created_at", "created_at");
      }

      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta", { keyPath: "key" });
      }
    },
  });

  return dbInstance;
}

export async function initMockData(): Promise<void> {
  const db = await getDB();
  const meta = await db.get("meta", "initialized");

  if (meta?.value) return;

  const tx = db.transaction(["contacts", "letters", "meta"], "readwrite");
  const contacts = mockContacts();
  const letters = mockLetters();

  await Promise.all(contacts.map((c) => tx.objectStore("contacts").put(c)));
  await Promise.all(letters.map((l) => tx.objectStore("letters").put(l)));
  await tx.objectStore("meta").put({ key: "initialized", value: true });

  await tx.done;
}

export async function resetDatabase(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(["contacts", "letters", "meta"], "readwrite");
  await tx.objectStore("contacts").clear();
  await tx.objectStore("letters").clear();
  await tx.objectStore("meta").clear();
  await tx.done;
  dbInstance = null;
}

// ========== Contacts ==========

export async function getAllContacts(): Promise<Contact[]> {
  const db = await getDB();
  return db.getAllFromIndex("contacts", "created_at");
}

export async function getContact(id: string): Promise<Contact | undefined> {
  const db = await getDB();
  return db.get("contacts", id);
}

export async function createContact(
  data: Omit<Contact, "id" | "created_at">
): Promise<Contact> {
  const db = await getDB();
  const contact: Contact = {
    ...data,
    id: generateId(),
    created_at: new Date().toISOString().split("T")[0],
  };
  await db.add("contacts", contact);
  return contact;
}

export async function updateContact(
  id: string,
  data: Partial<Contact>
): Promise<void> {
  const db = await getDB();
  const existing = await db.get("contacts", id);
  if (!existing) return;
  const updated: Contact = { ...existing, ...data };
  await db.put("contacts", updated);
}

export async function deleteContact(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("contacts", id);
}

export async function findOrCreateContact(
  name: string,
  extra: Partial<Contact> = {}
): Promise<Contact> {
  const db = await getDB();
  const all = await db.getAllFromIndex("contacts", "name");
  const found = all.find((c) => c.name === name);
  if (found) return found;

  return createContact({
    name,
    address: extra.address || "",
    city: extra.city || "",
    country: extra.country || "",
    notes: extra.notes || "",
  });
}

// ========== Letters ==========

export async function getAllLetters(): Promise<Letter[]> {
  const db = await getDB();
  const items = await db.getAllFromIndex("letters", "created_at");
  return items.reverse();
}

export async function getLetter(id: string): Promise<Letter | undefined> {
  const db = await getDB();
  return db.get("letters", id);
}

export async function getLettersByContact(contactId: string): Promise<Letter[]> {
  const db = await getDB();
  const items = await db.getAllFromIndex("letters", "contact_id", contactId);
  return items.sort((a, b) => {
    const da = a.received_date || a.sent_date || "";
    const db = b.received_date || b.sent_date || "";
    return db.localeCompare(da);
  });
}

export async function createLetter(
  data: Omit<Letter, "id" | "created_at" | "updated_at">
): Promise<Letter> {
  const db = await getDB();
  const now = new Date().toISOString().split("T")[0];
  const letter: Letter = {
    ...data,
    id: generateId(),
    created_at: now,
    updated_at: now,
  };
  await db.add("letters", letter);
  return letter;
}

export async function updateLetter(
  id: string,
  data: Partial<Letter>
): Promise<void> {
  const db = await getDB();
  const existing = await db.get("letters", id);
  if (!existing) return;
  const updated: Letter = {
    ...existing,
    ...data,
    updated_at: new Date().toISOString().split("T")[0],
  };
  await db.put("letters", updated);
}

export async function deleteLetter(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("letters", id);
}

export async function markReplied(
  id: string,
  replyId: string | null = null
): Promise<void> {
  await updateLetter(id, { is_replied: true, reply_to_id: replyId });
}
