
"use client";

import { useState, useEffect } from 'react';
import type { GenerateTriviaQuestionsOutput } from '@/ai/flows/generate-trivia-questions';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Timer, Star } from 'lucide-react';

type TriviaQuestion = GenerateTriviaQuestionsOutput['questions'][0];

interface QuizViewProps {
  question: TriviaQuestion;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  currentIndex: number;
  totalQuestions: number;
  score: number;
  userAnswer: string | null;
}

const ROUND_TIME = 30;

export function QuizView({
  question,
  onAnswer,
  onNext,
  currentIndex,
  totalQuestions,
  score,
  userAnswer,
}: QuizViewProps) {
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  useEffect(() => {
    setTimeLeft(ROUND_TIME);
    setFeedback(null);
  }, [question]);

  useEffect(() => {
    if (userAnswer || timeLeft <= 0) {
        // Stop timer
        return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, userAnswer]);
  
  useEffect(() => {
    if (timeLeft <= 0 && !userAnswer) {
      handleNext();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, userAnswer]);


  const handleAnswerClick = (option: string) => {
    if (userAnswer) return;
    onAnswer(option);
    const isCorrect = option === question.answer;
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    setTimeout(() => {
      handleNext();
    }, 1200);
  };
  
  const handleNext = () => {
    onNext();
  }

  const progressValue = ((currentIndex + 1) / totalQuestions) * 100;

  const getButtonClass = (option: string) => {
    if (!userAnswer) return 'bg-secondary hover:bg-secondary/80';
    if (option === question.answer) return 'bg-green-500 hover:bg-green-500 text-white animate-pulse';
    if (option === userAnswer && option !== question.answer) return 'bg-destructive hover:bg-destructive text-destructive-foreground animate-shake';
    return 'bg-secondary/50 text-muted-foreground';
  };
  
  const getIcon = (option: string) => {
    if (!userAnswer) return null;
    if (option === question.answer) return <CheckCircle className="mr-2 h-5 w-5" />;
    if (option === userAnswer) return <XCircle className="mr-2 h-5 w-5" />;
    return null;
  }

  return (
    <div className="w-full animate-fade-in-fast">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-auto order-2 sm:order-1">
          <Progress value={progressValue} className="h-3" />
          <p className="text-sm text-muted-foreground mt-1 text-center sm:text-left">Question {currentIndex + 1} of {totalQuestions}</p>
        </div>
        <div className="flex gap-4 order-1 sm:order-2">
            <div className="flex items-center gap-2 text-lg font-bold text-primary">
                <Star className="h-6 w-6 text-accent fill-current" />
                <span>{score}</span>
            </div>
            <div className="flex items-center gap-2 text-lg font-bold">
                <Timer className={`h-6 w-6 ${timeLeft <= 5 ? 'text-destructive animate-ping' : 'text-primary'}`} />
                <span>{timeLeft}s</span>
            </div>
        </div>
      </div>

      <p className="text-xl sm:text-2xl font-semibold text-center mb-8 min-h-[6rem] flex items-center justify-center font-headline">
        {question.question}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options.map((option) => (
          <Button
            key={option}
            onClick={() => handleAnswerClick(option)}
            disabled={!!userAnswer}
            className={`h-auto min-h-[4rem] whitespace-normal justify-start text-left p-4 text-base transition-all duration-300 ${getButtonClass(option)}`}
          >
            {getIcon(option)}
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
