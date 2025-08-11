
import React, { useState, useMemo, useEffect, useCallback, useReducer } from 'react';
import { AppMode, Attempt, Option, Question, Stats, Review } from './types';
import * as db from './data/db';
import { LogoIcon, HomeIcon, BookOpenIcon, CompassIcon, BookmarkIcon, ThumbsDownIcon, ActivityIcon, FileTextIcon, StarIcon, SparklesIcon, ArrowRightIcon, ChevronDownIcon, CheckCircleIcon, XCircleIcon, InfoIcon, LoaderIcon, SunIcon, MoonIcon } from './components/Icons';
import questionBank1 from './data/question_bank_1.json';
import questionBank2 from './data/question_bank_2.json';
import questionBank3 from './data/question_bank_3.json';

const AREAS = [ "CLÍNICA MÉDICA", "CLÍNICA CIRÚRGICA", "DIAGNÓSTICO POR IMAGEM", "ANESTESIOLOGIA", "LABORATÓRIO CLÍNICO", "SAÚDE PÚBLICA" ];

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
        { id: 'stats', label: 'Estatísticas', icon: ActivityIcon },
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
                            {theme === 'light' ? <MoonIcon className="w-5 h-5"/> : <SunIcon className="w-5 h-5"/>}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

const AreaFilter: React.FC<{ selectedArea: string; onSelectArea: (area: string) => void; }> = ({ selectedArea, onSelectArea }) => {
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
                        <a href="#" onClick={(e) => { e.preventDefault(); onSelectArea("Todas"); setIsOpen(false); }} className={cx("block px-4 py-2 text-sm", selectedArea === "Todas" ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700")}>Todas</a>
                        {AREAS.map(area => (
                            <a href="#" key={area} onClick={(e) => { e.preventDefault(); onSelectArea(area); setIsOpen(false); }} className={cx("block px-4 py-2 text-sm", selectedArea === area ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700")}>{area.charAt(0) + area.slice(1).toLowerCase()}</a>
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
                {review.fisiologia && <div><strong>Fisiologia/Patogenia 🧬:</strong><p>{review.fisiologia}</p></div>}
                {review.diagnostico?.principais && <div><strong>Diagnóstico Chave 🩺:</strong>{renderList(review.diagnostico.principais)}</div>}
                {review.terapia?.caes && <div><strong>Tratamento Padrão 💊:</strong>{renderList(review.terapia.caes)}</div>}
                {review.high_yield && <div><strong>Pontos de Alto Rendimento ⚠️:</strong>{renderList(review.high_yield)}</div>}
                {review.pegadinhas && <div><strong>Pegadinhas Comuns 🧐:</strong>{renderList(review.pegadinhas)}</div>}
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
            
            {q.media[0]?.uri && <img src={q.media[0].uri} alt={q.media[0].alt} className="my-4 rounded-lg w-full max-w-lg mx-auto bg-white p-2" />}

            <div className="space-y-3">
                {q.options.filter(o => o.text !== '—' && o.text).map(option => (
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
                            { (confirmed || mode === 'sim_review') && q.rationales && q.rationales[option.label] && (
                                <div className="mt-2 text-xs flex items-start gap-2">
                                    {q.answer_key === option.label ? <CheckCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-500 flex-shrink-0 mt-0.5"/> : <XCircleIcon className="w-4 h-4 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />}
                                    <p className="text-slate-600 dark:text-slate-300">{q.rationales[option.label]}</p>
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>
            
            <div className="mt-6 flex justify-between items-end">
                 { (confirmed || mode !== 'quiz') && <QuestionReviewDisplay review={q.review} />}

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
                        Próxima <ArrowRightIcon className="w-5 h-5"/>
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
    answers: Record