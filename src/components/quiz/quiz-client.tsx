
"use client";

import { useState } from 'react';
import type { GenerateTriviaQuestionsOutput } from '@/ai/flows/generate-trivia-questions';
import { generateTriviaQuestions } from '@/ai/flows/generate-trivia-questions';

import { TopicSelection } from './topic-selection';
import { QuizView } from './quiz-view';
import { ResultsView } from './results-view';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type GameState = 'idle' | 'loading' | 'playing' | 'finished';
type TriviaQuestion = GenerateTriviaQuestionsOutput['questions'][0];

export function QuizClient() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);

  const { toast } = useToast();

  const handleStartQuiz = async (topic: string) => {
    setGameState('loading');
    try {
      const result = await generateTriviaQuestions({ topic, numberOfQuestions: 10 });
      if (result.questions && result.questions.length > 0) {
        setQuestions(result.questions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setUserAnswers(new Array(result.questions.length).fill(null));
        setGameState('playing');
      } else {
        toast({
          variant: "destructive",
          title: "Failed to generate questions",
          description: "The AI could not generate questions for this topic. Please try another one.",
        });
        setGameState('idle');
      }
    } catch (error) {
      console.error('Error generating trivia questions:', error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Something went wrong. Please try again later.",
      });
      setGameState('idle');
    }
  };

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === questions[currentQuestionIndex].answer;
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newUserAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setGameState('finished');
    }
  };
  
  const handlePlayAgain = () => {
    setGameState('idle');
    setQuestions([]);
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'idle':
        return <TopicSelection onStartQuiz={handleStartQuiz} />;
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg font-semibold">Generating your trivia questions...</p>
            <p className="text-muted-foreground">This may take a moment.</p>
          </div>
        );
      case 'playing':
        return (
          <QuizView
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            score={score}
            userAnswer={userAnswers[currentQuestionIndex]}
          />
        );
      case 'finished':
        return <ResultsView score={score} totalQuestions={questions.length} onPlayAgain={handlePlayAgain} />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-2xl border-2 border-primary/20">
      <CardContent className="p-6 sm:p-8 md:p-12">
        {renderGameState()}
      </CardContent>
    </Card>
  );
}
