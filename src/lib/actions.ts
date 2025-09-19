'use server';

import { categorizeTransactionWithAI } from '@/ai/flows/categorize-transactions-with-ai';
import { z } from 'zod';

const formSchema = z.object({
  description: z.string().min(3, 'توضیحات باید حداقل ۳ کاراکتر باشد'),
});

export type FormState = {
  message: string;
  category: string;
  reasoning: string;
  isSuccess: boolean;
};

export async function getCategorySuggestion(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      message: 'توضیحات نامعتبر است.',
      category: '',
      reasoning: '',
      isSuccess: false,
    };
  }

  const { description } = validatedFields.data;

  try {
    const result = await categorizeTransactionWithAI({ transactionDescription: description });
    if (result.suggestedCategory) {
      return {
        message: 'دسته‌بندی با موفقیت پیشنهاد شد.',
        category: result.suggestedCategory,
        reasoning: result.reasoning,
        isSuccess: true,
      };
    } else {
       return { message: 'خطا در دریافت پیشنهاد.', category: '', reasoning: '', isSuccess: false };
    }
  } catch (error) {
    console.error(error);
    return { message: 'خطایی در ارتباط با هوش مصنوعی رخ داد.', category: '', reasoning: '', isSuccess: false };
  }
}
