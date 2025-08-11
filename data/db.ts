
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

// Valida e normaliza uma questão para o schema interno.
export function validateAndNormalizeQuestion(input: any): Question | null {
    try {
        const hasId = typeof input?.id === 'string' && input.id.trim().length > 0;
        const generatedId = (globalThis.crypto?.randomUUID?.() ?? `AI-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        const id = hasId ? input.id.trim() : generatedId;

        const areaTags = Array.isArray(input?.area_tags) ? input.area_tags : [];
        const topicTags = Array.isArray(input?.topic_tags) ? input.topic_tags : [];

        const q: Question = {
            id,
            year: Number.isFinite(Number(input?.year)) ? Number(input.year) : 0,
            exam: typeof input?.exam === 'string' ? input.exam : '—',
            source_file: input?.source_file ?? null,
            source_pages: input?.source_pages ?? { start: null, end: null },
            area_tags: areaTags,
            topic_tags: topicTags,
            classification_meta: input?.classification_meta ?? { area_confidence: {}, topic_confidence: {}, evidence_spans: [], ambiguities: [] },
            difficulty: (['F','M','D'] as const).includes(input?.difficulty) ? input.difficulty : 'M',
            cognitive_level: (['Lembrar','Entender','Aplicação','Análise'] as const).includes(input?.cognitive_level) ? input.cognitive_level : 'Entender',
            stem: typeof input?.stem === 'string' ? input.stem : '',
            media: Array.isArray(input?.media) ? input.media : [],
            options: Array.isArray(input?.options) ? input.options : [],
            answer_type: input?.answer_type === 'single' ? 'single' : 'single',
            answer_key: typeof input?.answer_key === 'string' ? input.answer_key : '',
            rationales: input?.rationales ?? {},
            review: input?.review ?? {},
            provenance: input?.provenance ?? { extracted_at: null, checksum: `sha256:${id}` },
            status: (['approved','pending','rejected'] as const).includes(input?.status) ? input.status : 'pending',
            version: Number.isFinite(Number(input?.version)) ? Number(input.version) : 1,
            issues: Array.isArray(input?.issues) ? input.issues : [],
        };

        // Regras mínimas para aceitar a questão
        if (!q.stem || q.stem.trim().length === 0) return null;
        if (!q.options?.length) return null;
        if (!q.answer_key) return null;
        if (!q.options.find((o: any) => o?.label === q.answer_key)) return null;

        return q;
    } catch {
        return null;
    }
}

// Upsert individual com transação curta
export async function upsertQuestion(question: Question): Promise<void> {
    const db = await getDb();
    await db.put(QUESTIONS_STORE, question);
}

// Upsert em chunks com tolerância a falhas por item
export async function upsertQuestionsInChunks(rawQuestions: any[], chunkSize = 50): Promise<{ inserted: number; updated: number; skipped: number; errors: { index: number; reason: string }[] }> {
    const result = { inserted: 0, updated: 0, skipped: 0, errors: [] as { index: number; reason: string }[] };
    const db = await getDb();

    for (let i = 0; i < rawQuestions.length; i += chunkSize) {
        const slice = rawQuestions.slice(i, i + chunkSize);
        for (let j = 0; j < slice.length; j++) {
            const globalIndex = i + j;
            const normalized = validateAndNormalizeQuestion(slice[j]);
            if (!normalized) {
                result.skipped++;
                result.errors.push({ index: globalIndex, reason: 'invalid-schema-or-missing-fields' });
                continue;
            }
            try {
                const existing = await db.get(QUESTIONS_STORE, normalized.id);
                await db.put(QUESTIONS_STORE, { ...existing, ...normalized });
                if (existing) result.updated++; else result.inserted++;
            } catch (e: any) {
                result.errors.push({ index: globalIndex, reason: e?.message ?? 'put-failed' });
            }
        }
    }

    console.log(`Upsert concluído: inserted=${result.inserted}, updated=${result.updated}, skipped=${result.skipped}, errors=${result.errors.length}`);
    if (result.errors.length) console.warn('Erros no upsert (primeiros 10):', result.errors.slice(0, 10));
    return result;
}

export async function bulkInsertQuestions(questions: Question[]) {
    // Mantido por compatibilidade; delega ao upsert robusto
    return upsertQuestionsInChunks(questions, 50);
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
