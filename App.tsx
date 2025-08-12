
import React, { useState, useEffect } from 'react';
import { getAllQuestions, bulkInsertQuestions, validateAndNormalizeQuestion } from './data/db';
import { Question } from './types';

// Importar os arquivos JSON das questões
import questionBank1 from './data/question_bank_1.json';
import questionBank2 from './data/question_bank_2.json';
import questionBank3 from './data/question_bank_3.json';
import questionBank4 from './data/question_bank_4.json';
import questionBankUFV2021 from './data/question_bank_ufv_2021.json';

// Função para carregar questões dos arquivos JSON para o IndexedDB
const loadQuestionsFromJSON = async () => {
  try {
    console.log('Carregando questões dos arquivos JSON...');
    
    const allQuestions: Question[] = [];
    
    // Carregar questões de cada arquivo
    const questionBanks = [
      { data: questionBank1, name: 'question_bank_1' },
      { data: questionBank2, name: 'question_bank_2' },
      { data: questionBank3, name: 'question_bank_3' },
      { data: questionBank4, name: 'question_bank_4' },
      { data: questionBankUFV2021, name: 'question_bank_ufv_2021' }
    ];
    
    for (const bank of questionBanks) {
      if (bank.data && bank.data.items && Array.isArray(bank.data.items)) {
        // Validar e normalizar cada questão
        for (const item of bank.data.items) {
          const validatedQuestion = validateAndNormalizeQuestion(item);
          if (validatedQuestion) {
            allQuestions.push(validatedQuestion);
          }
        }
        console.log(`Carregadas ${bank.data.items.length} questões de ${bank.name}`);
      }
    }
    
    if (allQuestions.length > 0) {
      await bulkInsertQuestions(allQuestions);
      console.log(`Total de ${allQuestions.length} questões carregadas no IndexedDB!`);
    }
    
  } catch (error) {
    console.error('Erro ao carregar questões:', error);
  }
};

const App = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const allQuestions = await getAllQuestions();
        if (allQuestions.length === 0) {
          // Se não há questões no IndexedDB, carregar dos arquivos JSON
          await loadQuestionsFromJSON();
          const newQuestions = await getAllQuestions();
          setQuestions(newQuestions);
        } else {
          setQuestions(allQuestions);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading questions:', error);
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      setShowAnswer(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando questões...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">VetPro - Residência Veterinária</h1>
          <p className="text-gray-600">Nenhuma questão encontrada.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">VetPro - Residência Veterinária</h1>
            <span className="text-sm text-gray-500">
              Questão {currentIndex + 1} de {questions.length}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {currentQuestion.stem}
          </h2>
          
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option) => (
              <button
                key={option.label}
                onClick={() => handleAnswerSelect(option.label)}
                disabled={showAnswer}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  selectedAnswer === option.label
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${
                  showAnswer
                    ? option.label === currentQuestion.answer_key
                      ? 'border-green-500 bg-green-50'
                      : selectedAnswer === option.label
                      ? 'border-red-500 bg-red-50'
                      : ''
                    : ''
                }`}
              >
                <span className="font-medium text-gray-900">
                  {option.label}. {option.text}
                </span>
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>

            {!showAnswer ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Responder
              </button>
            ) : (
              <div className="text-sm text-gray-600">
                Resposta: {currentQuestion.answer_key}
              </div>
            )}
          </div>
        </div>

        {showAnswer && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Explicação
            </h3>
            <div className="space-y-4">
              {currentQuestion.options.map((option) => (
                <div
                  key={option.label}
                  className={`p-4 rounded-lg border-2 ${
                    option.label === currentQuestion.answer_key
                      ? 'border-green-500 bg-green-50'
                      : selectedAnswer === option.label
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="font-medium text-gray-900">
                      {option.label}.
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-900 mb-2">{option.text}</p>
                      <p className="text-sm text-gray-600">
                        {currentQuestion.rationales[option.label]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;