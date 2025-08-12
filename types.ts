
export interface ClassificationMeta {
  area_confidence: Record<string, number>;
  topic_confidence: Record<string, number>;
  evidence_spans: string[];
  ambiguities: string[];
}

export interface Media {
  type: 'image' | 'video';
  uri: string | null;
  alt: string;
}

export interface Option {
  label: string;
  text: string;
}

export interface Rationales {
  [key: string]: string; // A, B, C, D, E
}

export interface Review {
  etiologia?: string;
  epidemiologia?: string;
  fisiologia?: string;
  anatomia?: string;
  patogenia?: string;
  diagnostico?: {
    principais?: string[];
    sens_espec?: Record<string, { sens: number; espec: number; comentario: string }>;
    achados_complementares?: {
      hemograma?: string[];
      bioquimica?: string[];
      imagem?: string[];
      urinálise?: string[];
      coproparasitologico?: string[];
    };
  };
  sintomatologia?: {
    aguda?: string[];
    cronica?: string[];
  };
  terapia?: {
    caes?: string[];
    gatos?: string[];
  };
  prevencao?: string[];
  pegadinhas?: string[];
  high_yield?: string[];
  referencias?: { obra: string; cap?: string; pg?: string | number }[];
}

export interface Provenance {
  extracted_at: string | null;
  checksum: string; // sha256:...
}

export interface TrainingQuestion {
  stem: string;
  options: Option[];
  answer_key: string;
  rationale: string;
}

export interface Question {
  id: string;
  year: number;
  exam: string;
  source_file: string | null;
  source_pages: { start: number | null; end: number | null };
  area_tags: string[];
  topic_tags: string[];
  classification_meta: ClassificationMeta;
  difficulty: 'F' | 'M' | 'D'; // Fácil, Médio, Difícil
  cognitive_level: 'Lembrar' | 'Entender' | 'Aplicação' | 'Análise';
  stem: string;
  media: Media[];
  options: Option[];
  answer_type: 'single';
  answer_key: string;
  rationales: Rationales;
  review: Review;
  training_question?: TrainingQuestion;
  provenance: Provenance;
  status: 'approved' | 'pending' | 'rejected';
  version: number;
  issues: string[];
}

export interface Attempt {
  id: string; // question id
  correct: boolean;
  areas: string[];
  topic: string;
}

export type AppMode = 'home' | 'quiz' | 'browse' | 'review' | 'errors' | 'stats' | 'sim' | 'favorites';

export interface Stats {
  total: number;
  correct: number;
  byArea: {
    [key: string]: { total: number; correct: number };
  };
  byTopic: {
    [key: string]: { total: number; correct: number; area: string };
  };
}
