
import { openDB, IDBPDatabase } from 'idb';
import { Question, Attempt } from '../types';

const DB_NAME = 'vetQA';
const DB_VERSION = 1;
const QUESTIONS_STORE = 'questions';
const ATTEMPTS_STORE = 'attempts';
const FAVORITES_STORE = 'favorites';
const TO_REVIEW_STORE = 'to_review';

// Singleton promise to avoid opening the DB multiple times.
let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
    if (typeof window === 'undefined') {
        return Promise.reject(new Error("IndexedDB não está disponível neste ambiente."));
    }
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db, oldVersion, newVersion, transaction) {
                console.log(`Atualizando o banco de dados da versão ${oldVersion} para ${newVersion}`);
                if (!db.objectStoreNames.contains(QUESTIONS_STORE)) {
                    db.createObjectStore(QUESTIONS_STORE, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(ATTEMPTS_STORE)) {
                    // Use an auto-incrementing key for attempts.
                    db.createObjectStore(ATTEMPTS_STORE, { autoIncrement: true });
                }
                 if (!db.objectStoreNames.contains(FAVORITES_STORE)) {
                    // Store objects with an 'id' property.
                    db.createObjectStore(FAVORITES_STORE, { keyPath: 'id' });
                }
                 if (!db.objectStoreNames.contains(TO_REVIEW_STORE)) {
                    db.createObjectStore(TO_REVIEW_STORE, { keyPath: 'id' });
                }
            },
        });
    }
    return dbPromise;
}

export async function clearQuestions() {
    const db = await getDb();
    await db.clear(QUESTIONS_STORE);
    console.log("Repositório de questões do DB limpo.");
}

export async function bulkInsertQuestions(questions: Question[]) {
    const db = await getDb();
    const tx = db.transaction(QUESTIONS_STORE, 'readwrite');
    // Using Promise.all for concurrent writes within the same transaction.
    await Promise.all(questions.map(q => tx.store.put(q)));
    await tx.done;
    console.log(`${questions.length} questões inseridas no banco de dados local.`);
}

export async function getAllQuestions(): Promise<Question[]> {
    const db = await getDb();
    return db.getAll(QUESTIONS_STORE);
}

export async function getSet(storeName: typeof FAVORITES_STORE | typeof TO_REVIEW_STORE): Promise<Set<string>> {
    const db = await getDb();
    const items = await db.getAll(storeName);
    return new Set(items.map(item => item.id));
}

export async function toggleInSet(storeName: typeof FAVORITES_STORE | typeof TO_REVIEW_STORE, id: string): Promise<Set<string>> {
    const db = await getDb();
    const tx = db.transaction(storeName, 'readwrite');
    const existing = await tx.store.get(id);
    if (existing) {
        await tx.store.delete(id);
    } else {
        await tx.store.put({ id });
    }
    await tx.done;
    // Return the updated set
    return getSet(storeName);
}

export async function addAttempt(attempt: Omit<Attempt, 'attemptId'>) {
    const db = await getDb();
    await db.add(ATTEMPTS_STORE, attempt);
}

export async function getAllAttempts(): Promise<Attempt[]> {
    const db = await getDb();
    return db.getAll(ATTEMPTS_STORE);
}
