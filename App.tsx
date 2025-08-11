
import React, { useState, useMemo, useEffect, useCallback, useReducer } from 'react';
import { AppMode, Attempt, Option, Question, Stats, Review } from './types';
import * as db from './data/db';
import { LogoIcon, HomeIcon, BookOpenIcon, CompassIcon, BookmarkIcon, ThumbsDownIcon, ActivityIcon, FileTextIcon, StarIcon, SparklesIcon, ArrowRightIcon, ChevronDownIcon, CheckCircleIcon, XCircleIcon, InfoIcon, LoaderIcon, SunIcon, MoonIcon } from './components/Icons';
import questionBank1 from './data/question_bank_1.json';
import questionBank2 from './data/question_bank_2.json';
import questionBank3 from './data/question_bank_3.json';
import questionBank4 from './data/question_bank_4.json';

const AREAS = [ 'CLÍNICA MÉDICA', 'CLÍNICA CIRÚRGICA', 'DIAGNÓSTICO POR IMAGEM', 'ANESTESIOLOGIA', 'LABORATÓRIO CLÍNICO', 'SAÚDE PÚBLICA' ];

const cx = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const Header: React.FC<{ 
  mode: AppMode; 
  setMode: (mode: AppMode) => void;
  theme: string;
  toggleTheme: () => void;
}> = ({ mode, setMode, theme, toggleTheme }) => {
  const navItems = [
    { id: 'home', label: 'Início', icon: HomeIcon },
    { id: 'quiz', label: 'Estudar', icon: BookOpenIcon },
    { id: 'browse', label: 'Navegar', icon: CompassIcon },
    { id: 'favorites', label: 'Favoritas', icon: StarIcon },
    { id: 'review', label: 'Marcadas', icon: BookmarkIcon },
    { id: 'errors', label: 'Erros', icon: ThumbsDownIcon },
    { id: 'sim', label: 'Simulados', icon: FileTextIcon },
    { id: 'stats', label: 'Estatísticas', icon: ActivityIcon }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-500">
              <LogoIcon />
              <span className="font-bold text-lg text-slate-800 dark:text-slate-200">VetPro</span>
            </div>
          </div>
          <div className="flex items-center">
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setMode(item.id as AppMode)}
                  className={cx(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    mode === item.id
                      ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
            <button onClick={toggleTheme} title="Alterar tema" className="ml-4 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const AreaFilter: React.FC<{ selectedArea: string; onSelectArea: (area: string) => void }> = ({ selectedArea, onSelectArea }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left mb-6">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex justify-center w-full rounded-md border border-slate-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
        >
          {selectedArea}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" />
        </button>
      </div>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                onSelectArea('Todas');
                setIsOpen(false);
              }}
              className={cx(
                'block px-4 py-2 text-sm',
                selectedArea === 'Todas'
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              )}
            >
              Todas
            </a>
            {AREAS.map(area => (
              <a
                href="#"
                key={area}
                onClick={e => {
                  e.preventDefault();
                  onSelectArea(area);
                  setIsOpen(false);
                }}
                className={cx(
                  'block px-4 py-2 text-sm',
                  selectedArea === area
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                )}
              >
                {area.charAt(0) + area.slice(1).toLowerCase()}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const QuestionReviewDisplay: React.FC<{ review: Review }> = ({ review }) => {
  const renderList = (items: string[] | undefined) => items && items.length > 0 && <ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>;

  if (!review || Object.keys(review).length === 0) {
    return null;
  }

  return (
    <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
      <h3 className="inline-flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
        <SparklesIcon className="w-6 h-6 text-sky-500" />
        Revisão Aprofundada
      </h3>
      <div className="prose prose-sm max-w-none prose-slate dark:prose-invert prose-strong:text-slate-800 dark:prose-strong:text-slate-100 space-y-4">
        {review.fisiologia && (
          <div>
            <strong>Fisiologia/Patogenia 🧬:</strong>
            <p>{review.fisiologia}</p>
          </div>
        )}
        {review.diagnostico?.principais && (
          <div>
            <strong>Diagnóstico Chave 🩺:</strong>
            {renderList(review.diagnostico.principais)}
          </div>
        )}
        {review.terapia?.caes && (
          <div>
            <strong>Tratamento Padrão 💊:</strong>
            {renderList(review.terapia.caes)}
          </div>
        )}
        {review.high_yield && (
          <div>
            <strong>Pontos de Alto Rendimento ⚠️:</strong>
            {renderList(review.high_yield)}
          </div>
        )}
        {review.pegadinhas && (
          <div>
            <strong>Pegadinhas Comuns 🧐:</strong>
            {renderList(review.pegadinhas)}
          </div>
        )}
      </div>
    </div>
  );
};

const QuestionCard: React.FC<{
  q: Question;
  mode: 'quiz' | 'browse' | 'sim_review';
  onConfirm?: (isCorrect: boolean) => void;
  onNext?: () => void;
  onToggleFavorite: (id: string) => void;
  onToggleToReview: (id: string) => void;
  isFavorite: boolean;
  isToReview: boolean;
  simAnswer?: string;
}> = ({ q, mode, onConfirm, onNext, onToggleFavorite, onToggleToReview, isFavorite, isToReview, simAnswer }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(mode !== 'quiz');

  useEffect(() => {
    setSelected(null);
    setConfirmed(mode !== 'quiz');
  }, [q, mode]);

  const handleConfirm = () => {
    if (!selected) return;
    setConfirmed(true);
    if (onConfirm) {
      const isCorrect = selected === q.answer_key;
      onConfirm(isCorrect);
    }
  };

  const getOptionClass = (option: Option) => {
    const isSelected = selected === option.label || (mode === 'sim_review' && simAnswer === option.label);
    const isCorrectAnswer = q.answer_key === option.label;

    if (!confirmed && mode === 'quiz') {
      return isSelected
        ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 ring-2 ring-sky-500'
        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-sky-400 dark:hover:border-sky-500';
    }
    if (isCorrectAnswer) return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-200';
    if (isSelected && !isCorrectAnswer) return 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-200';
    return 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400';
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-semibold text-sky-700 dark:text-sky-400">({q.exam}-{q.year}) {q.area_tags.join(', ')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onToggleFavorite(q.id)} title="Favoritar">
            <StarIcon className={cx('w-6 h-6 transition-colors', isFavorite ? 'text-yellow-400 fill-current' : 'text-slate-400 hover:text-yellow-400')} />
          </button>
          <button onClick={() => onToggleToReview(q.id)} title="Marcar para Revisar">
            <BookmarkIcon className={cx('w-6 h-6 transition-colors', isToReview ? 'text-sky-500 fill-current' : 'text-slate-400 hover:text-sky-500')} />
          </button>
        </div>
      </div>

      <p className="text-slate-800 dark:text-slate-200 text-base leading-relaxed mb-4 whitespace-pre-wrap">{q.stem}</p>

      {q.media?.[0]?.uri && <img src={q.media?.[0]?.uri} alt={q.media?.[0]?.alt} className="my-4 rounded-lg w-full max-w-lg mx-auto bg-white p-2" />}

      <div className="space-y-3">
        {q.options
          .filter(o => o.text !== '—' && o.text)
          .map(option => (
            <button
              key={option.label}
              onClick={() => mode === 'quiz' && !confirmed && setSelected(option.label)}
              disabled={mode !== 'quiz' || confirmed}
              className={cx(
                'w-full text-left p-4 rounded-lg border-2 transition-all flex items-start gap-4',
                getOptionClass(option),
                mode === 'quiz' && !confirmed ? 'cursor-pointer' : 'cursor-default'
              )}
            >
              <div className="flex-shrink-0 font-bold text-sm w-6 h-6 flex items-center justify-center rounded-full border-2 border-current">{option.label}</div>
              <div className="flex-grow">
                <p className="font-medium text-sm">{option.text}</p>
                {(confirmed || mode === 'sim_review') && q.rationales && q.rationales[option.label] && (
                  <div className="mt-2 text-xs flex items-start gap-2">
                    {q.answer_key === option.label ? (
                      <CheckCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-slate-600 dark:text-slate-300">{q.rationales[option.label]}</p>
                  </div>
                )}
              </div>
            </button>
          ))}
      </div>

      <div className="mt-6 flex justify-between items-end">
        {(confirmed || mode !== 'quiz') && <QuestionReviewDisplay review={q.review} />}        
        {mode === 'quiz' && !confirmed && (
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className="ml-auto px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-sm hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            Confirmar
          </button>
        )}
        {mode === 'quiz' && confirmed && (
          <button
            onClick={onNext}
            className="ml-auto inline-flex items-center gap-2 px-6 py-2 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-semibold rounded-lg shadow-sm hover:bg-slate-900 dark:hover:bg-white transition-colors"
          >
            Próxima <ArrowRightIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// --- REDUCER E LÓGICA DO SIMULADO ---

type SimState = {
  status: 'config' | 'running' | 'finished';
  questions: Question[];
  answers: Record<string, string>;
  currentIndex: number;
  config: { n: number; areas: Set<string> };
};

type SimAction =
  | { type: 'START_SIM'; payload: { questions: Question[] } }
  | { type: 'ANSWER'; payload: { questionId: string; answer: string } }
  | { type: 'RESET_SIM' }
  | { type: 'SET_CONFIG'; payload: { n?: number; areas?: Set<string> } };

const initialSimState: SimState = {
  status: 'config',
  questions: [],
  answers: {},
  currentIndex: 0,
  config: { n: 10, areas: new Set() }
};

function simReducer(state: SimState, action: SimAction): SimState {
  switch (action.type) {
    case 'SET_CONFIG':
      return { ...state, config: { ...state.config, ...action.payload } };
    case 'START_SIM':
      return { ...state, status: 'running', questions: action.payload.questions, currentIndex: 0, answers: {} };
    case 'ANSWER': {
      const newAnswers = { ...state.answers, [action.payload.questionId]: action.payload.answer };
      const isLastQuestion = state.currentIndex === state.questions.length - 1;
      return {
        ...state,
        answers: newAnswers,
        currentIndex: isLastQuestion ? state.currentIndex : state.currentIndex + 1,
        status: isLastQuestion ? 'finished' : 'running'
      };
    }
    case 'RESET_SIM':
      return initialSimState;
    default:
      return state;
  }
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<AppMode>('home');
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [toReview, setToReview] = useState<Set<string>>(new Set());

  const getInitialTheme = (): string => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) return storedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  const [theme, setTheme] = useState<string>(getInitialTheme());

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    async function initApp() {
      try {
        const questionBankItems: Question[] = [
          ...(questionBank1 as any).items,
          ...(questionBank2 as any).items,
          ...(questionBank3 as any).items,
          ...(questionBank4 as any).items
        ];
        try {
          await db.upsertQuestionsInChunks(questionBankItems, 50);
          const [questions, favs, revs, atts] = await Promise.all([
            db.getAllQuestions(),
            db.getSet('favorites'),
            db.getSet('to_review'),
            db.getAllAttempts()
          ]);
          setAllQuestions(questions);
          setFavorites(favs);
          setToReview(revs);
          setAttempts(atts);
        } catch (dbError) {
          console.error('Falha ao inicializar IndexedDB, usando fallback em memória', dbError);
          setAllQuestions(questionBankItems);
        }
      } finally {
        setIsLoading(false);
      }
    }
    initApp();
  }, []);

  const handleAddAttempt = useCallback(async (isCorrect: boolean, q: Question) => {
    const newAttempt: Attempt = { id: q.id, correct: isCorrect, areas: q.area_tags, topic: q.topic_tags[0] };
    await db.addAttempt(newAttempt);
    setAttempts(prev => [...prev, newAttempt]);
  }, []);

  const handleToggleFavorite = useCallback(async (id: string) => {
    const newSet = await db.toggleInSet('favorites', id);
    setFavorites(newSet);
  }, []);

  const handleToggleToReview = useCallback(async (id: string) => {
    const newSet = await db.toggleInSet('to_review', id);
    setToReview(newSet);
  }, []);

  const [simState, simDispatch] = useReducer(simReducer, initialSimState);

  useEffect(() => {
    if (simState.status === 'finished') {
      const newAttempts = simState.questions.map(q => {
        const isCorrect = q.answer_key === simState.answers[q.id];
        return { id: q.id, correct: isCorrect, areas: q.area_tags, topic: q.topic_tags[0] } as Attempt;
      });
      newAttempts.forEach(attempt => db.addAttempt(attempt));
      setAttempts(prev => [...prev, ...newAttempts]);
    }
  }, [simState.status, simState.questions, simState.answers]);

  const stats: Stats = useMemo(() => {
    const initialStats: any = { total: 0, correct: 0, byArea: {}, byTopic: {} };
    AREAS.forEach(area => (initialStats.byArea[area] = { total: 0, correct: 0 }));
    return attempts.reduce((acc: any, attempt: any) => {
      acc.total++;
      if (attempt.correct) acc.correct++;
      attempt.areas.forEach((area: string) => {
        if (!acc.byArea[area]) acc.byArea[area] = { total: 0, correct: 0 };
        acc.byArea[area].total++;
        if (attempt.correct) acc.byArea[area].correct++;
      });
      if (attempt.topic) {
        if (!acc.byTopic[attempt.topic]) acc.byTopic[attempt.topic] = { total: 0, correct: 0, area: attempt.areas[0] };
        acc.byTopic[attempt.topic].total++;
        if (attempt.correct) acc.byTopic[attempt.topic].correct++;
      }
      return acc;
    }, initialStats);
  }, [attempts]);

  const frequentErrors = useMemo(() => {
    return Object.entries(stats.byTopic)
      .map(([topic, data]: any) => ({ topic, ...data, accuracy: data.total > 0 ? data.correct / data.total : 0 }))
      .filter((item: any) => item.total > 1)
      .sort((a: any, b: any) => a.accuracy - b.accuracy)
      .slice(0, 10);
  }, [stats]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center p-12">
          <LoaderIcon className="w-12 h-12 mx-auto animate-spin text-sky-500" />
        </div>
      );
    }
    switch (mode) {
      case 'home':
        return <HomePage setMode={setMode} stats={stats} />;
      case 'quiz':
      case 'browse':
      case 'review':
      case 'errors':
      case 'favorites':
        return (
          <StudyView
            mode={mode}
            allQuestions={allQuestions}
            favorites={favorites}
            toReview={toReview}
            frequentErrors={frequentErrors as any[]}
            onConfirmAttempt={handleAddAttempt}
            toggleFavorite={handleToggleFavorite}
            toggleToReview={handleToggleToReview}
          />
        );
      case 'stats':
        return <StatsView stats={stats} frequentErrors={frequentErrors as any[]} />;
      case 'sim':
        return (
          <SimulationView
            allQuestions={allQuestions}
            state={simState}
            dispatch={simDispatch}
            toggleFavorite={handleToggleFavorite}
            toggleToReview={handleToggleToReview}
            favorites={favorites}
            toReview={toReview}
          />
        );
      default:
        return <div className="text-center">Modo desconhecido ou não implementado.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header mode={mode} setMode={setMode} theme={theme} toggleTheme={toggleTheme} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">{renderContent()}</main>
    </div>
  );
}

const HomePage: React.FC<{ setMode: (mode: AppMode) => void; stats: Stats }> = ({ setMode, stats }) => (
  <div className="text-center">
    <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">Bem-vindo(a) ao VetPro</h1>
    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">Sua plataforma inteligente para conquistar a aprovação. Estude com questões, aprofunde-se com IA e teste seus conhecimentos.</p>
    <div className="mt-8 flex justify-center gap-4">
      <button onClick={() => setMode('quiz')} className="px-8 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-sm hover:bg-sky-700 transition-colors">Começar a Estudar</button>
      <button onClick={() => setMode('sim')} className="px-8 py-3 bg-slate-800 dark:bg-slate-700 text-white font-semibold rounded-lg shadow-sm hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors">Criar Simulado</button>
    </div>
    <div className="mt-12 max-w-lg mx-auto bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Seu Progresso</h3>
      {stats.total > 0 ? (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{stats.total}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Respondidas</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">{stats.correct}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Corretas</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-sky-600 dark:text-sky-500">{`${((stats.correct / stats.total) * 100).toFixed(0)}%`}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Aproveitamento</p>
          </div>
        </div>
      ) : (
        <p className="text-slate-500 dark:text-slate-400">Você ainda não respondeu nenhuma questão. Vamos começar?</p>
      )}
    </div>
  </div>
);

const StudyView: React.FC<{
  mode: 'quiz' | 'browse' | 'review' | 'errors' | 'favorites';
  allQuestions: Question[];
  favorites: Set<string>;
  toReview: Set<string>;
  frequentErrors: any[];
  onConfirmAttempt: (isCorrect: boolean, q: Question) => void;
  toggleFavorite: (id: string) => void;
  toggleToReview: (id: string) => void;
}> = ({ mode, allQuestions, favorites, toReview, frequentErrors, onConfirmAttempt, toggleFavorite, toggleToReview }) => {
  const [areaFilter, setAreaFilter] = useState('Todas');
  const [questionPool, setQuestionPool] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const basePool = useMemo(() => {
    if (!allQuestions || allQuestions.length === 0) return [];
    switch (mode) {
      case 'favorites':
        return allQuestions.filter(q => favorites.has(q.id));
      case 'review':
        return allQuestions.filter(q => toReview.has(q.id));
      case 'errors': {
        const errorTopics = new Set(frequentErrors.map(e => e.topic));
        return allQuestions.filter(q => q.topic_tags.some(t => errorTopics.has(t)));
      }
      default:
        return allQuestions;
    }
  }, [mode, allQuestions, favorites, toReview, frequentErrors]);

  useEffect(() => {
    const filteredByArea = areaFilter === 'Todas' ? basePool : basePool.filter(q => q.area_tags.includes(areaFilter.toUpperCase()));
    setQuestionPool(shuffle(filteredByArea));
    setCurrentIndex(0);
  }, [basePool, areaFilter]);

  const currentQuestion = questionPool[currentIndex];

  const handleConfirmQuiz = (isCorrect: boolean) => {
    if (!currentQuestion) return;
    onConfirmAttempt(isCorrect, currentQuestion);
  };

  const handleNextQuestion = () => {
    setCurrentIndex(prev => (prev + 1) % questionPool.length);
  };

  return (
    <div>
      <AreaFilter selectedArea={areaFilter} onSelectArea={setAreaFilter} />
      {questionPool.length > 0 && currentQuestion ? (
        <>
          <QuestionCard
            q={currentQuestion}
            mode={mode === 'quiz' ? 'quiz' : 'browse'}
            onConfirm={handleConfirmQuiz}
            onNext={handleNextQuestion}
            onToggleFavorite={toggleFavorite}
            onToggleToReview={toggleToReview}
            isFavorite={favorites.has(currentQuestion.id)}
            isToReview={toReview.has(currentQuestion.id)}
          />
          {mode !== 'quiz' && questionPool.length > 1 && (
            <div className="mt-6 flex justify-between">
              <button onClick={() => setCurrentIndex(p => (p - 1 + questionPool.length) % questionPool.length)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Anterior</button>
              <span className="self-center text-slate-600 dark:text-slate-400">{currentIndex + 1} / {questionPool.length}</span>
              <button onClick={handleNextQuestion} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Próxima</button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Nenhuma questão encontrada.</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Tente selecionar outra área, ou marque algumas questões como favoritas/para revisar.</p>
        </div>
      )}
    </div>
  );
};

const StatsView: React.FC<{ stats: Stats; frequentErrors: any[] }> = ({ stats, frequentErrors }) => (
  <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Suas Estatísticas</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300">Total de Respostas</p>
        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{stats.total}</p>
      </div>
      <div className="bg-emerald-50 dark:bg-emerald-900/40 p-4 rounded-lg text-center">
        <p className="text-sm text-emerald-700 dark:text-emerald-300">Respostas Corretas</p>
        <p className="text-3xl font-bold text-emerald-800 dark:text-emerald-200">{stats.correct}</p>
      </div>
      <div className="bg-sky-50 dark:bg-sky-900/40 p-4 rounded-lg text-center">
        <p className="text-sm text-sky-700 dark:text-sky-300">Aproveitamento Geral</p>
        <p className="text-3xl font-bold text-sky-800 dark:text-sky-200">{stats.total > 0 ? `${((stats.correct / stats.total) * 100).toFixed(1)}%` : 'N/A'}</p>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Desempenho por Área</h3>
        <div className="space-y-3">
          {Object.entries(stats.byArea)
            .filter(([, data]: any) => data.total > 0)
            .sort(([, a]: any, [, b]: any) => b.total - a.total)
            .map(([area, data]: any) => {
              const acc = data.total > 0 ? (data.correct / data.total) * 100 : 0;
              return (
                <div key={area}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-600 dark:text-slate-300">{(area as string).charAt(0) + (area as string).slice(1).toLowerCase()}</span>
                    <span className="text-slate-500 dark:text-slate-400">{acc.toFixed(1)}% ({data.correct}/{data.total})</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${acc}%` }} />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Tópicos com Mais Erros</h3>
        <div className="space-y-2">
          {frequentErrors.length > 0 ? (
            (frequentErrors as any[]).map((item: any) => (
              <div key={item.topic} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg">
                <p className="font-semibold text-sm text-red-900 dark:text-red-200">{item.topic}</p>
                <p className="text-xs text-red-700 dark:text-red-300">{item.area.charAt(0) + item.area.slice(1).toLowerCase()} | Acerto: {(item.accuracy * 100).toFixed(1)}% ({item.correct}/{item.total})</p>
              </div>
            ))
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-sm">Nenhum erro frequente para exibir. Continue praticando!</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const SimulationView: React.FC<{
  allQuestions: Question[];
  state: SimState;
  dispatch: React.Dispatch<SimAction>;
  toggleFavorite: (id: string) => void;
  toggleToReview: (id: string) => void;
  favorites: Set<string>;
  toReview: Set<string>;
}> = ({ allQuestions, state, dispatch, toggleFavorite, toggleToReview, favorites, toReview }) => {
  const handleStart = () => {
    const chosenAreas = state.config.areas.size ? state.config.areas : new Set(AREAS);
    const candidates = allQuestions.filter(q => [...chosenAreas].some(a => q.area_tags.includes(a)));
    const questions = shuffle(candidates).slice(0, Math.min(state.config.n, candidates.length));
    dispatch({ type: 'START_SIM', payload: { questions } });
  };

  if (state.status === 'running') {
    const q = state.questions[state.currentIndex];
    return (
      <div>
        <div className="text-center mb-4">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">Simulado em Progresso</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Questão {state.currentIndex + 1} de {state.questions.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-semibold uppercase text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/50 px-2 py-1 rounded-full inline-block mb-2">{q.area_tags.map(a => a.charAt(0) + a.slice(1).toLowerCase()).join(', ')}</p>
          <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap mb-4">{q.stem}</p>
          {q.media?.[0]?.uri && <img src={q.media?.[0]?.uri} alt={q.media?.[0]?.alt} className="my-4 rounded-lg w-full max-w-lg mx-auto" />}
          <div className="space-y-3">
            {q.options.filter(o => o.text !== '—' && o.text).map(option => (
              <button
                key={option.label}
                onClick={() => dispatch({ type: 'ANSWER', payload: { questionId: q.id, answer: option.label } })}
                className="w-full text-left p-4 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-sky-500 dark:hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-all flex items-start gap-4"
              >
                <div className="flex-shrink-0 font-bold text-sm w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-400 dark:border-slate-500">{option.label}</div>
                <p className="font-medium text-sm text-slate-700 dark:text-slate-200">{option.text}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (state.status === 'finished') {
    const correctCount = state.questions.filter(q => q.answer_key === state.answers[q.id]).length;
    const total = state.questions.length;
    return (
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm text-center">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Simulado Concluído!</h2>
        <p className="text-6xl font-bold my-4 text-slate-800 dark:text-slate-100">
          {correctCount} <span className="text-2xl text-slate-500 dark:text-slate-400">/ {total}</span>
        </p>
        <p className="text-2xl font-semibold text-sky-600 dark:text-sky-500 mb-8">Aproveitamento: {total > 0 ? ((correctCount / total) * 100).toFixed(1) : 0}%</p>
        <div className="max-h-[60vh] overflow-y-auto border-t border-b border-slate-200 dark:border-slate-700 my-6 py-4 space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 text-left">Revisão do Simulado</h3>
          {state.questions.map(q => (
            <QuestionCard
              key={q.id}
              q={q}
              mode="sim_review"
              simAnswer={state.answers[q.id]}
              onToggleFavorite={toggleFavorite}
              onToggleToReview={toggleToReview}
              isFavorite={favorites.has(q.id)}
              isToReview={toReview.has(q.id)}
            />
          ))}
        </div>
        <button onClick={() => dispatch({ type: 'RESET_SIM' })} className="mt-4 px-8 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-sm hover:bg-sky-700 transition-colors">
          Novo Simulado
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm max-w-lg mx-auto border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Configurar Simulado</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Número de questões</label>
        <input
          type="number"
          value={state.config.n}
          onChange={e => dispatch({ type: 'SET_CONFIG', payload: { n: parseInt(e.target.value, 10) || 10 } })}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Áreas (deixe em branco para todas)</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {AREAS.map(area => (
            <label key={area} className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={state.config.areas.has(area)}
                onChange={e => {
                  const newAreas = new Set(state.config.areas);
                  if (e.target.checked) newAreas.add(area);
                  else newAreas.delete(area);
                  dispatch({ type: 'SET_CONFIG', payload: { areas: newAreas } });
                }}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">{area.charAt(0) + area.slice(1).toLowerCase()}</span>
            </label>
          ))}
        </div>
      </div>
      <button onClick={handleStart} className="w-full px-8 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-sm hover:bg-sky-700 transition-colors">Iniciar Simulado</button>
    </div>
  );
};