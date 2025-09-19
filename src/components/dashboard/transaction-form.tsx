'use client';

import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCategorySuggestion, type FormState } from '@/lib/actions';
import type { Transaction } from '@/lib/types';
import { Sparkles, LoaderCircle, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const initialState: FormState = {
  message: '',
  category: '',
  reasoning: '',
  isSuccess: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full gap-2">
      {pending ? <LoaderCircle className="animate-spin" /> : <Sparkles />}
      دریافت پیشنهاد هوش مصنوعی
    </Button>
  );
}

export function TransactionForm({ onSubmit }: { onSubmit: (data: Omit<Transaction, 'id'>) => void }) {
  const [state, formAction] = useFormState(getCategorySuggestion, initialState);
  const descriptionRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (state.message && !state.isSuccess) {
      toast({
        title: "خطا",
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Omit<Transaction, 'id'> = {
      description: formData.get('description') as string,
      amount: Number(formData.get('amount')),
      date: formData.get('date') as string,
      type: formData.get('type') as 'income' | 'expense',
      category: formData.get('category') as string,
    };
    if (data.description && data.amount && data.date && data.type && data.category) {
        onSubmit(data);
    } else {
        toast({
            title: "خطا",
            description: "لطفاً تمام فیلدها را پر کنید.",
            variant: "destructive",
        });
    }
  };
  
  return (
    <div className="space-y-4">
      <form action={formAction}>
        <div className="space-y-2">
          <Label htmlFor="description_ai">توضیحات</Label>
          <Input id="description_ai" name="description" ref={descriptionRef} required placeholder="مثال: خرید قهوه برای دفتر" />
        </div>
        <div className="mt-4">
            <SubmitButton />
        </div>
      </form>

      {state.isSuccess && state.category && (
        <Card className="bg-accent/20 border-accent">
          <CardHeader className='py-4'>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="text-accent" />
              پیشنهاد هوش مصنوعی
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm pb-4">
            <p><strong>دسته‌بندی:</strong> {state.category}</p>
            <p className="text-muted-foreground"><strong>دلیل:</strong> {state.reasoning}</p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="grid gap-4 pt-4 border-t">
        <input type="hidden" name="description" value={descriptionRef.current?.value || ''} />
        <div className="space-y-2">
          <Label htmlFor="amount">مبلغ (تومان)</Label>
          <Input id="amount" name="amount" type="number" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">تاریخ</Label>
          <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">نوع</Label>
          <Select name="type" required dir="rtl">
            <SelectTrigger>
              <SelectValue placeholder="انتخاب نوع تراکنش" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">درآمد</SelectItem>
              <SelectItem value="expense">هزینه</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">دسته‌بندی</Label>
          <Input id="category" name="category" defaultValue={state.category} required />
        </div>
        <Button type="submit">ذخیره تراکنش</Button>
      </form>
    </div>
  );
}
