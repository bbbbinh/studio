
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Lightbulb, Sparkles } from 'lucide-react';

const formSchema = z.object({
  topic: z.string().min(2, { message: 'Topic must be at least 2 characters.' }).max(50),
});

interface TopicSelectionProps {
  onStartQuiz: (topic: string) => void;
}

export function TopicSelection({ onStartQuiz }: TopicSelectionProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onStartQuiz(values.topic);
  }

  return (
    <div className="flex flex-col items-center text-center animate-fade-in">
      <div className="flex items-center gap-4 mb-4">
        <Lightbulb className="h-12 w-12 text-primary" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-headline">BrainWave Blitz</h1>
      </div>
      <p className="text-lg text-muted-foreground mb-8">
        Challenge your knowledge with AI-generated trivia!
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm space-y-6">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Topic</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a topic, e.g., 'Ancient Rome'" {...field} className="text-center h-12 text-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="lg" className="w-full text-lg font-bold">
            <Sparkles className="mr-2 h-5 w-5" />
            Start Quiz
          </Button>
        </form>
      </Form>
    </div>
  );
}
