
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { getAllQuestions, upsertQuestionsInChunks } from './data/db';
import questionBank1 from './data/question_bank_1.json';
import questionBank2 from './data/question_bank_2.json';
import questionBank3 from './data/question_bank_3.json';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Elemento root não encontrado para montar o aplicativo.");
}

const root = ReactDOM.createRoot(rootElement);

async function bootstrapAndRender() {
  try {
    // Popula o IndexedDB na primeira execução (origem nova), se estiver vazio
    const existing = await getAllQuestions();
    if (!Array.isArray(existing) || existing.length === 0) {
      const items = [
        ...(Array.isArray((questionBank1 as any)?.items) ? (questionBank1 as any).items : []),
        ...(Array.isArray((questionBank2 as any)?.items) ? (questionBank2 as any).items : []),
        ...(Array.isArray((questionBank3 as any)?.items) ? (questionBank3 as any).items : []),
      ];
      if (items.length > 0) {
        await upsertQuestionsInChunks(items, 50);
      }
    }
  } catch (e) {
    // Evita bloquear o render em caso de falha na semente; o app ainda renderiza
    console.warn('Falha ao semear o banco de questões:', e);
  } finally {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}

bootstrapAndRender();
