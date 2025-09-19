'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

export default function TaxPage() {
    const [income, setIncome] = React.useState('');
    const [taxRate, setTaxRate] = React.useState('9');
    const [estimatedTax, setEstimatedTax] = React.useState<number | null>(null);

    const calculateTax = (e: React.FormEvent) => {
        e.preventDefault();
        const incomeValue = parseFloat(income);
        const taxRateValue = parseFloat(taxRate);
        if (!isNaN(incomeValue) && !isNaN(taxRateValue)) {
            setEstimatedTax((incomeValue * taxRateValue) / 100);
        }
    };

    return (
        <div className="w-full h-full flex flex-col">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline tracking-tight">مالیات</h1>
                <p className="text-muted-foreground">مالیات بر ارزش افزوده و نرخ مالیات خود را محاسبه کنید.</p>
            </div>

            <div className="flex-1 flex items-center justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>محاسبه‌گر مالیات بر ارزش افزوده</CardTitle>
                        <CardDescription>مالیات تخمینی خود را بر اساس درآمد و نرخ مالیات محاسبه کنید.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={calculateTax} className="space-y-4">
                          <div className="space-y-2">
                              <Label htmlFor="income">مجموع درآمد (تومان)</Label>
                              <Input id="income" type="number" placeholder="50,000,000" value={income} onChange={(e) => setIncome(e.target.value)} required/>
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="tax-rate">نرخ مالیات (%)</Label>
                              <Input id="tax-rate" type="number" placeholder="9" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} required/>
                          </div>
                          <Button type="submit" className="w-full">
                              <Calculator className="ml-2 h-4 w-4" />
                              محاسبه
                          </Button>
                      </form>

                        {estimatedTax !== null && (
                            <div className="mt-6 p-4 bg-primary/10 rounded-lg text-center">
                                <p className="text-sm text-muted-foreground">مالیات تخمینی شما</p>
                                <p className="text-3xl font-bold text-primary" dir="ltr">
                                    {estimatedTax.toLocaleString()} تومان
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
