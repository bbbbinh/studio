
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating trivia questions on a specific topic.
 *
 * - generateTriviaQuestions - A function that generates trivia questions on a given topic.
 * - GenerateTriviaQuestionsInput - The input type for the generateTriviaQuestions function.
 * - GenerateTriviaQuestionsOutput - The output type for the generateTriviaQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TriviaQuestionSchema = z.object({
  question: z.string().describe('The trivia question.'),
  options: z.array(z.string()).length(4).describe('An array of 4 multiple-choice options.'),
  answer: z.string().describe('The correct answer, which must be one of the options.'),
});

const GenerateTriviaQuestionsInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate trivia questions.'),
  numberOfQuestions: z
    .number()
    .default(10)
    .describe('The number of trivia questions to generate.'),
});
export type GenerateTriviaQuestionsInput = z.infer<
  typeof GenerateTriviaQuestionsInputSchema
>;

const GenerateTriviaQuestionsOutputSchema = z.object({
  questions: z.array(TriviaQuestionSchema).describe('The generated trivia questions.'),
});
export type GenerateTriviaQuestionsOutput = z.infer<
  typeof GenerateTriviaQuestionsOutputSchema
>;

export async function generateTriviaQuestions(
  input: GenerateTriviaQuestionsInput
): Promise<GenerateTriviaQuestionsOutput> {
  return generateTriviaQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTriviaQuestionsPrompt',
  input: {schema: GenerateTriviaQuestionsInputSchema},
  output: {schema: GenerateTriviaQuestionsOutputSchema},
  prompt: `You are a trivia question generator. Generate {{numberOfQuestions}} trivia questions on the topic of {{topic}}. For each question, provide 4 multiple-choice options and specify the correct answer. The correct answer must be one of the provided options.

Format the output as a JSON object that strictly adheres to the following schema:
{
  "questions": [
    {
      "question": "The trivia question.",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "The correct option."
    }
  ]
}

Ensure that the questions are diverse and cover different aspects of the topic.`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const generateTriviaQuestionsFlow = ai.defineFlow(
  {
    name: 'generateTriviaQuestionsFlow',
    inputSchema: GenerateTriviaQuestionsInputSchema,
    outputSchema: GenerateTriviaQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
