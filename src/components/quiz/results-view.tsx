
"use client";

import { Button } from '@/components/ui/button';
import { Trophy, RotateCw } from 'lucide-react';

interface ResultsViewProps {
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
}

export function ResultsView({ score, totalQuestions, onPlayAgain }: ResultsViewProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  let message = '';

  if (percentage === 100) {
    message = "Perfect score! You're a trivia master!";
  } else if (percentage >= 80) {
    message = "Excellent job! You really know your stuff.";
  } else if (percentage >= 50) {
    message = "Good effort! A very respectable score.";
  } else {
    message = "You gave it a shot! Every quiz is a chance to learn.";
  }


  return (
    <div className="flex flex-col items-center text-center animate-fade-in">
      <Trophy className="h-20 w-20 text-accent mb-4" />
      <h2 className="text-3xl sm:text-4xl font-bold font-headline mb-2">Quiz Complete!</h2>
      <p className="text-lg text-muted-foreground mb-6">{message}</p>
      
      <div className="bg-primary/10 rounded-lg p-6 mb-8 w-full max-w-xs">
        <p className="text-lg text-primary font-semibold">Your Score</p>
        <p className="text-5xl font-bold text-primary my-2">
          {score} <span className="text-3xl text-primary/80">/ {totalQuestions}</span>
        </p>
        <p className="text-2xl font-semibold text-accent">{percentage}%</p>
      </div>

      <Button onClick={onPlayAgain} size="lg" className="text-lg font-bold">
        <RotateCw className="mr-2 h-5 w-5" />
        Play Again
      </Button>
    </div>
  );
}
