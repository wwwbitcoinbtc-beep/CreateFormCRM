'use client';

import { ArrowLeftRight, DollarSign, ReceiptText, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockTransactions, chartData } from '@/lib/data';
import Link from 'next/link';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
    const totalIncome = mockTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = mockTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const netProfit = totalIncome - totalExpense;

    const recentTransactions = mockTransactions.slice(0, 5);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between space-y-2">
                <h1 className="text-3xl font-bold font-headline tracking-tight">داشبورد</h1>
                <div className="flex items-center space-x-2 space-x-reverse">
                    <Link href="/dashboard/transactions">
                        <Button>
                            <PlusCircle className="ml-2 h-4 w-4" />
                            تراکنش جدید
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">مجموع درآمد</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold" dir="ltr">{totalIncome.toLocaleString()} تومان</div>
                        <p className="text-xs text-muted-foreground">در ۳۰ روز گذشته</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">مجموع هزینه</CardTitle>
                        <ReceiptText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold" dir="ltr">{totalExpense.toLocaleString()} تومان</div>
                        <p className="text-xs text-muted-foreground">در ۳۰ روز گذشته</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">سود خالص</CardTitle>
                        <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-primary' : 'text-destructive'}`} dir="ltr">
                            {netProfit.toLocaleString()} تومان
                        </div>
                        <p className="text-xs text-muted-foreground">درآمد منهای هزینه</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>درآمد در مقابل هزینه</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 5 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Bar dataKey="income" fill="hsl(var(--chart-1))" radius={4} />
                                    <Bar dataKey="expense" fill="hsl(var(--chart-2))" radius={4} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>تراکنش‌های اخیر</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>توضیحات</TableHead>
                                    <TableHead>نوع</TableHead>
                                    <TableHead className="text-left">مبلغ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentTransactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell className="font-medium">{transaction.description}</TableCell>
                                        <TableCell>
                                            <Badge variant={transaction.type === 'income' ? 'secondary' : 'destructive'}>
                                                {transaction.type === 'income' ? 'درآمد' : 'هزینه'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-left" dir="ltr">{transaction.amount.toLocaleString()} تومان</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
