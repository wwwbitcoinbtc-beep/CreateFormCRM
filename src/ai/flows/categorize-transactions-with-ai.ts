'use server';
/**
 * @fileOverview This file defines a Genkit flow for automatically categorizing transactions using AI.
 *
 * It takes a transaction description as input and returns a suggested category.
 *
 * @remarks
 * - categorizeTransactionWithAI - The main function that triggers the categorization flow.
 * - CategorizeTransactionInput - The input type for the categorizeTransactionWithAI function.
 * - CategorizeTransactionOutput - The output type for the categorizeTransactionWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeTransactionInputSchema = z.object({
  transactionDescription: z
    .string()
    .describe('The description of the transaction to categorize.'),
});
export type CategorizeTransactionInput = z.infer<
  typeof CategorizeTransactionInputSchema
>;

const CategorizeTransactionOutputSchema = z.object({
  suggestedCategory: z
    .string()
    .describe('The AI-suggested category for the transaction.'),
  reasoning: z
    .string()
    .describe('The AI reasoning behind the suggested category.'),
});
export type CategorizeTransactionOutput = z.infer<
  typeof CategorizeTransactionOutputSchema
>;

export async function categorizeTransactionWithAI(
  input: CategorizeTransactionInput
): Promise<CategorizeTransactionOutput> {
  return categorizeTransactionFlow(input);
}

const categorizeTransactionPrompt = ai.definePrompt({
  name: 'categorizeTransactionPrompt',
  input: {schema: CategorizeTransactionInputSchema},
  output: {schema: CategorizeTransactionOutputSchema},
  prompt: `You are an AI assistant specializing in categorizing financial transactions.
  Given the following transaction description, suggest a category and explain your reasoning.

  Transaction Description: {{{transactionDescription}}}

  Consider common accounting categories such as:
  - "Rent/Mortgage"
  - "Utilities"
  - "Salary/Wages"
  - "Food/Dining"
  - "Transportation"
  - "Entertainment"
  - "Healthcare"
  - "Supplies"
  - "Travel"
  - "Taxes"
  - "Insurance"
  - "Education"
  - "Savings/Investments"
  - "Other"

  Provide a suggested category and a brief explanation of your reasoning.
  Format your answer as a JSON object with "suggestedCategory" and "reasoning" fields.
`,
});

const categorizeTransactionFlow = ai.defineFlow(
  {
    name: 'categorizeTransactionFlow',
    inputSchema: CategorizeTransactionInputSchema,
    outputSchema: CategorizeTransactionOutputSchema,
  },
  async input => {
    const {output} = await categorizeTransactionPrompt(input);
    return output!;
  }
);
